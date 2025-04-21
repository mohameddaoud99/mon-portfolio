import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";

// Interface pour les données du formulaire
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  access_key: string;
  botcheck?: boolean;
}

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      access_key: "9562f177-8efb-477a-9a1f-3f6befbdf4cf" // Remplacez par votre clé Web3Forms
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Message envoyé",
          description: "Merci ! Votre message a été envoyé avec succès.",
          variant: "default",
        });
        
        // Réinitialiser le formulaire
        reset();
      } else {
        toast({
          title: "Erreur",
          description: result.message || "Une erreur s'est produite lors de l'envoi de votre message.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="section-container animate-fade-in">
        <h2 className="section-title text-portfolio-blue">Get In Touch</h2>
        <p className="section-subtitle">
          Have a question or want to work together? Drop me a message!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-portfolio-light-gray p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-portfolio-dark-blue mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-portfolio-blue p-3 rounded-full text-white mr-4">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-portfolio-dark-blue">
                      Email
                    </p>
                    <a
                      href="mailto:contact@example.com"
                      className="text-portfolio-blue hover:text-portfolio-dark-blue transition-colors"
                    >
                      mohamed.tijani.daoud@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-portfolio-blue p-3 rounded-full text-white mr-4">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-portfolio-dark-blue">
                      Phone
                    </p>
                    <a
                      href="tel:+1234567890"
                      className="text-portfolio-blue hover:text-portfolio-dark-blue transition-colors"
                    >
                      +(216) 54040502
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-portfolio-blue p-3 rounded-full text-white mr-4">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-portfolio-dark-blue">
                      Location
                    </p>
                    <p className="text-portfolio-dark-gray">Ariana, Tunisia</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h4 className="text-lg font-semibold text-portfolio-dark-blue mb-4">
                  Connect with me
                </h4>
                <div className="flex space-x-4">
                  {/* Social Media Icons */}
                  <a
                    href="http://www.linkedin.com/in/mohamed-tijani-daoud-aab02518a"
                    className="bg-portfolio-blue text-white p-3 rounded-full hover:bg-portfolio-dark-blue transition-colors"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.552v-11.452h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zm-15.11-13.019c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019h-3.564v-11.452h3.564v11.452z" />
                    </svg>
                  </a>
                  <a
                    href="http://github.com/mohameddaoud99"
                    className="bg-portfolio-blue text-white p-3 rounded-full hover:bg-portfolio-dark-blue transition-colors"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Web3Forms Integration */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-portfolio-dark-blue mb-6">Send Me a Message</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Champ caché pour Web3Forms access key */}
              <input type="hidden" {...register("access_key")} />
              
              {/* Honeypot pour protéger contre le spam */}
              <input
                type="checkbox"
                className="hidden"
                style={{ display: "none" }}
                {...register("botcheck")}
              />
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-portfolio-dark-gray mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  {...register("name", {
                    required: "Full name is required"
                  })}
                  className={`w-full ${errors.name ? "border-red-500" : ""}`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message?.toString()}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-portfolio-dark-gray mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email address"
                    }
                  })}
                  className={`w-full ${errors.email ? "border-red-500" : ""}`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message?.toString()}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-portfolio-dark-gray mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  {...register("subject", {
                    required: "Subject is required"
                  })}
                  className={`w-full ${errors.subject ? "border-red-500" : ""}`}
                  placeholder="What is this regarding?"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-500">{errors.subject.message?.toString()}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-portfolio-dark-gray mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  {...register("message", {
                    required: "Message is required"
                  })}
                  className={`w-full min-h-[150px] ${errors.message ? "border-red-500" : ""}`}
                  placeholder="Your message here..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message.message?.toString()}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-portfolio-blue hover:bg-portfolio-dark-blue text-white py-3"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
