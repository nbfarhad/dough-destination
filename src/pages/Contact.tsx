
import React from "react";
import Layout from "@/components/layout/Layout";
import ContactForm from "@/components/contact/ContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Instagram, Phone, MessageSquare, WhatsApp } from "lucide-react";

const Contact: React.FC = () => {
  return (
    <Layout>
      <div className="bg-muted py-10">
        <div className="pizza-container">
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle">
            We're here to help! Reach out to us with any questions or concerns.
          </p>
        </div>
      </div>

      <div className="pizza-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <ContactForm />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Our Information</h2>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Location & Hours</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Address:</h4>
                    <address className="not-italic text-muted-foreground">
                      123 Pizza Street<br />
                      New York, NY 10001
                    </address>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Hours:</h4>
                    <ul className="text-muted-foreground">
                      <li className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>11:00 - 22:00</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Saturday</span>
                        <span>11:00 - 23:00</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Sunday</span>
                        <span>12:00 - 22:00</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-pizza-primary" />
                    <a href="tel:+1234567890" className="text-muted-foreground hover:text-pizza-primary">
                      (123) 456-7890
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-pizza-primary" />
                    <a href="mailto:info@pizzalicious.com" className="text-muted-foreground hover:text-pizza-primary">
                      info@pizzalicious.com
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <WhatsApp className="h-5 w-5 text-pizza-primary" />
                    <a href="https://wa.me/1234567890" className="text-muted-foreground hover:text-pizza-primary">
                      WhatsApp Chat
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Facebook className="h-5 w-5 text-pizza-primary" />
                    <a href="https://facebook.com/pizzalicious" className="text-muted-foreground hover:text-pizza-primary">
                      facebook.com/pizzalicious
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Instagram className="h-5 w-5 text-pizza-primary" />
                    <a href="https://instagram.com/pizzalicious" className="text-muted-foreground hover:text-pizza-primary">
                      instagram.com/pizzalicious
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
