'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendContactEmail, type ContactFormData } from '@/lib/actions/contact';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send email using server action
      const result = await sendContactEmail(formData as ContactFormData);
      
      if (result.success) {
        toast({
          title: "Message sent successfully!",
          description: result.message,
          action: (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ),
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        toast({
          title: "Failed to send message",
          description: result.message,
          variant: "destructive",
          action: (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ),
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        action: (
          <AlertCircle className="h-5 w-5 text-red-500" />
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-foreground">
        Send Message
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="bg-background/50 border-border focus:border-primary"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="bg-background/50 border-border focus:border-primary"
              placeholder="your.email@example.com"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
            Subject *
          </label>
          <Input
            id="subject"
            name="subject"
            type="text"
            required
            value={formData.subject}
            onChange={handleChange}
            className="bg-background/50 border-border focus:border-primary"
            placeholder="Project discussion, collaboration, etc."
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
            Message *
          </label>
          <Textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className="bg-background/50 border-border focus:border-primary resize-none"
            placeholder="Tell me about your project, timeline, budget, and any specific requirements..."
          />
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full glow-button iconic"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send size={18} className="mr-2 stroke" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
