import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";

import {
  motion,
  AnimatePresence,
  type Transition,
  type VariantLabels,
  type Target,
  type TargetAndTransition,
} from "motion/react";

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

export interface RotatingTextRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

export interface RotatingTextProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof motion.span>,
    "children" | "transition" | "initial" | "animate" | "exit"
  > {
  texts: string[];
  transition?: Transition;
  initial?: boolean | Target | VariantLabels;
  animate?: boolean | VariantLabels | TargetAndTransition;
  exit?: Target | VariantLabels;
  animatePresenceMode?: "sync" | "wait";
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

const RotatingText = forwardRef<RotatingTextRef, RotatingTextProps>(
  (
    {
      texts,
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-120%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      ...rest
    },
    ref
  ) => {
    const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);

    const splitIntoCharacters = (text: string): string[] => {
      if (typeof Intl !== "undefined" && (Intl as any).Segmenter) {
        const segmenter = new (Intl as any).Segmenter("en", {
          granularity: "grapheme",
        });

        return Array.from(segmenter.segment(text), (segment: any) =>
          segment.segment
        );
      }

      return Array.from(text);
    };

    const elements = useMemo(() => {
      const currentText: string = texts[currentTextIndex];

      if (splitBy === "characters") {
        const words = currentText.split(" ");

        return words.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== words.length - 1,
        }));
      }

      if (splitBy === "words") {
        return currentText.split(" ").map((word, i, arr) => ({
          characters: [word],
          needsSpace: i !== arr.length - 1,
        }));
      }

      if (splitBy === "lines") {
        return currentText.split("\n").map((line, i, arr) => ({
          characters: [line],
          needsSpace: i !== arr.length - 1,
        }));
      }

      return currentText.split(splitBy).map((part, i, arr) => ({
        characters: [part],
        needsSpace: i !== arr.length - 1,
      }));
    }, [texts, currentTextIndex, splitBy]);

    const getStaggerDelay = useCallback(
      (index: number, totalChars: number): number => {
        const total = totalChars;

        if (staggerFrom === "first") return index * staggerDuration;

        if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;

        if (staggerFrom === "center") {
          const center = Math.floor(total / 2);
          return Math.abs(center - index) * staggerDuration;
        }

        if (staggerFrom === "random") {
          const randomIndex = Math.floor(Math.random() * total);
          return Math.abs(randomIndex - index) * staggerDuration;
        }

        return Math.abs((staggerFrom as number) - index) * staggerDuration;
      },
      [staggerFrom, staggerDuration]
    );

    const handleIndexChange = useCallback(
      (newIndex: number) => {
        setCurrentTextIndex(newIndex);
        if (onNext) onNext(newIndex);
      },
      [onNext]
    );

    const next = useCallback(() => {
      const nextIndex =
        currentTextIndex === texts.length - 1
          ? loop
            ? 0
            : currentTextIndex
          : currentTextIndex + 1;

      if (nextIndex !== currentTextIndex) handleIndexChange(nextIndex);
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);

    const previous = useCallback(() => {
      const prevIndex =
        currentTextIndex === 0
          ? loop
            ? texts.length - 1
            : currentTextIndex
          : currentTextIndex - 1;

      if (prevIndex !== currentTextIndex) handleIndexChange(prevIndex);
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);

    const jumpTo = useCallback(
      (index: number) => {
        const validIndex = Math.max(0, Math.min(index, texts.length - 1));
        if (validIndex !== currentTextIndex) handleIndexChange(validIndex);
      },
      [texts.length, currentTextIndex, handleIndexChange]
    );

    const reset = useCallback(() => {
      if (currentTextIndex !== 0) handleIndexChange(0);
    }, [currentTextIndex, handleIndexChange]);

    useImperativeHandle(
      ref,
      () => ({ next, previous, jumpTo, reset }),
      [next, previous, jumpTo, reset]
    );

    useEffect(() => {
      if (!auto) return;
      const intervalId = setInterval(next, rotationInterval);
      return () => clearInterval(intervalId);
    }, [next, rotationInterval, auto]);

    const containerRef = useRef<HTMLSpanElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const [measuredWidth, setMeasuredWidth] = useState<number>(0);
    const [ready, setReady] = useState<boolean>(false);
    const [firstWidthCommitted, setFirstWidthCommitted] = useState<boolean>(false);

    useLayoutEffect(() => {
      const measure = (): void => {
        if (!measureRef.current) return;
        const rect = measureRef.current.getBoundingClientRect();
        setMeasuredWidth(rect.width);
        if (rect.width > 0) {
          setReady(true);
        }
      };

      // Measure immediately before paint
      measure();

      // Re-measure on element resize
      const ro = new ResizeObserver(() => measure());
      if (measureRef.current) ro.observe(measureRef.current);

      // Re-measure on window resize and after fonts load
      const onResize = (): void => measure();
      window.addEventListener("resize", onResize);
      const fontsReady: Promise<unknown> | undefined = (document as any).fonts?.ready;
      let cancelled = false;
      if (fontsReady) {
        fontsReady.then(() => { if (!cancelled) measure(); });
      }

      return () => {
        cancelled = true;
        ro.disconnect();
        window.removeEventListener("resize", onResize);
      };
    }, [texts, currentTextIndex, splitBy, mainClassName]);

    // After the first measured width is rendered without animation, enable width animations
    useEffect(() => {
      if (ready && !firstWidthCommitted) {
        const id = requestAnimationFrame(() => setFirstWidthCommitted(true));
        return () => cancelAnimationFrame(id);
      }
    }, [ready, firstWidthCommitted]);

    const currentText = useMemo(() => texts[currentTextIndex], [texts, currentTextIndex]);

    return (
      <motion.span
        ref={containerRef}
        className={cn("inline-flex whitespace-nowrap relative", mainClassName)}
        {...rest}
        layout
        initial={false}
        animate={ready ? { width: measuredWidth } : {}}
        transition={{
          ...transition,
          layout: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
          width: { duration: firstWidthCommitted ? 0.18 : 0, ease: [0.22, 1, 0.36, 1] },
        }}
        style={{
          overflow: "hidden",
          width: ready ? measuredWidth : 'auto',
        }}
      >
        <span
          ref={measureRef}
          className={cn(
            "invisible absolute left-0 top-0 pointer-events-none whitespace-pre",
            mainClassName
          )}
        >
          {currentText}
        </span>

        <span className="sr-only">{texts[currentTextIndex]}</span>

        <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
          <motion.span
            key={currentTextIndex}
            className={cn(
              splitBy === "lines" ? "flex flex-col w-full" : "inline-flex flex-nowrap whitespace-nowrap relative"
            )}
            layout
            aria-hidden="true"
          >
            {elements.map((wordObj, wordIndex, array) => {
              const previousCharsCount = array
                .slice(0, wordIndex)
                .reduce((sum, word) => sum + word.characters.length, 0);

              return (
                <span key={wordIndex} className={cn("inline-flex", splitLevelClassName)}>
                  {wordObj.characters.map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      initial={initial}
                      animate={animate}
                      exit={exit}
                      transition={{
                        ...transition,
                        delay: getStaggerDelay(
                          previousCharsCount + charIndex,
                          array.reduce((sum, word) => sum + word.characters.length, 0)
                        ),
                      }}
                      className={cn("inline-block", elementLevelClassName)}
                    >
                      {char}
                    </motion.span>
                  ))}

                  {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
                </span>
              );
            })}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    );
  }
);

RotatingText.displayName = "RotatingText";

export default RotatingText;
