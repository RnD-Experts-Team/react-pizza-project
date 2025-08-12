import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Shield, Eye, Lock, Database, Calendar, Mail } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
        </p>
        <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-blue-600" />
              1. Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support.
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Personal Information:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Name, email address, and phone number</li>
                  <li>Delivery address and billing information</li>
                  <li>Payment method details (processed securely)</li>
                  <li>Order history and preferences</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Automatically Collected Information:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                  <li>Usage patterns and interaction data</li>
                  <li>Location data (with your permission)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-green-600" />
              2. How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Process and fulfill your pizza orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send promotional offers and updates (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card>
          <CardHeader>
            <CardTitle>3. Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
            </p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Service Providers:</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  We share information with trusted third-party service providers who help us operate our business, 
                  such as payment processors, delivery services, and cloud hosting providers.
                </p>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Legal Requirements:</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  We may disclose information when required by law, court order, or government request, 
                  or to protect our rights and safety.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-red-600" />
              4. Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>SSL encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and employee training</li>
              <li>Payment card industry (PCI) compliance</li>
            </ul>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 mt-4">
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Important:</strong> While we strive to protect your information, no method of transmission over the internet 
                or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights and Choices */}
        <Card>
          <CardHeader>
            <CardTitle>5. Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              You have several rights regarding your personal information:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground">Access & Update</h4>
                  <p className="text-sm text-muted-foreground">View and update your account information anytime</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">Request deletion of your account and data</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground">Marketing Opt-out</h4>
                  <p className="text-sm text-muted-foreground">Unsubscribe from promotional emails</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Data Portability</h4>
                  <p className="text-sm text-muted-foreground">Request a copy of your data</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>6. Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Essential Cookies</h4>
                  <p className="text-sm text-muted-foreground">Required for basic website functionality</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Analytics Cookies</h4>
                  <p className="text-sm text-muted-foreground">Help us understand how you use our website</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-foreground">Marketing Cookies</h4>
                  <p className="text-sm text-muted-foreground">Used to show relevant advertisements</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>7. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information 
              from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, 
              please contact us immediately.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card>
          <CardHeader>
            <CardTitle>8. Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy 
              periodically for any changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact Us */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              9. Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium">Privacy Officer - Pizza Portal</p>
              <p className="text-muted-foreground">Email: privacy@pizzaportal.com</p>
              <p className="text-muted-foreground">Phone: 1-800-PRIVACY</p>
              <p className="text-muted-foreground">Address: 123 Pizza Street, Food City, FC 12345</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />
      
      <div className="text-center text-sm text-muted-foreground">
        <p>
          By using Pizza Portal, you consent to the collection and use of your information as described in this Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;