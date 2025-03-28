
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Facebook, MessageSquare, Phone } from "lucide-react";

const AlternativeOrdering: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Alternative Ordering Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Don't want to order online? No problem! Choose one of our other ordering methods below:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-2 h-auto py-3"
            onClick={() => window.open("https://wa.me/1234567890", "_blank")}
          >
            <MessageCircle className="h-5 w-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium">WhatsApp</div>
              <div className="text-xs text-muted-foreground">Message us to place your order</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-2 h-auto py-3"
            onClick={() => window.open("https://m.me/pizzalicious", "_blank")}
          >
            <Facebook className="h-5 w-5 text-blue-600" />
            <div className="text-left">
              <div className="font-medium">Facebook Messenger</div>
              <div className="text-xs text-muted-foreground">Chat with us on Facebook</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-2 h-auto py-3"
            onClick={() => window.open("sms:+1234567890", "_blank")}
          >
            <MessageSquare className="h-5 w-5 text-purple-600" />
            <div className="text-left">
              <div className="font-medium">Text Message</div>
              <div className="text-xs text-muted-foreground">Send us a text to order</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-2 h-auto py-3"
            onClick={() => window.open("tel:+1234567890", "_blank")}
          >
            <Phone className="h-5 w-5 text-red-600" />
            <div className="text-left">
              <div className="font-medium">Phone</div>
              <div className="text-xs text-muted-foreground">Call us directly</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlternativeOrdering;
