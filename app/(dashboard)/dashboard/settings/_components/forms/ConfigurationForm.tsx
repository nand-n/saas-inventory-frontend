'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import axiosInstance from '@/lib/axiosInstance';
import { ConfigFormData } from '@/types/configTypes.type';
import { useToast } from '@/components/ui/commons/toastProvider';
import { handleApiError } from '@/lib/utils';
import { useForm } from 'react-hook-form';

const countries =[{
  code:"ET",
name:"Ethiopia"
}]


interface ConfigFormProps {
  tenantId:string
}
export type ConfigFormHandle = {
  submitForm: () => void
}

export const ConfigurationForm = forwardRef<ConfigFormHandle,ConfigFormProps>(
  ({ tenantId } , ref)  =>{

        const { register, handleSubmit, reset } = useForm<ConfigFormData>({
          defaultValues: {
            tenantId,
            themeSettings: {
              primaryColor: '#000000',
              secondaryColor: '#000000',
              darkMode: false,
              fontFamily: 'Arial',
            },
            logos: {
              desktop: '',
              mobile: '',
              favicon: '',
              brandName: '',
            },
            socialMedias: {},
            enabledModules: [],
            securitySettings: {
              requireTwoFactorAuth: false,
              passwordComplexity: 1,
              sessionTimeout: 30,
              loginAttemptsLimit: 5,
            },
            paymentConfiguration: {
              currency: 'USD',
              paymentGateway: '',
              apiKey: '',
              sandboxMode: true,
            },
            seoSettings: {
              metaTitle: '',
              metaDescription: '',
              keywords: [''],
              canonicalUrl: '',
            },
            localization: {
              timezone: 'UTC',
              dateFormat: 'MM/DD/YYYY',
              timeFormat: 'HH:mm',
              defaultLanguage: 'en',
              supportedLanguages: ['en'],
            },
            analytics: {
              googleAnalyticsId: '',
              trackingPixel: '',
              heatmapEnabled: false,
            },
            customFields: [],
            contactInformation: {
              email: '',
              phone: '',
              address: '',
              city: '',
              country: '',
              postalCode: '',
            },
          }
        })

  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ConfigFormData>({
    tenantId,
    themeSettings: {
      primaryColor: '#000000',
      secondaryColor: '#000000',
      darkMode: false,
      fontFamily: 'Arial',
    },
    logos: {
      desktop: '',
      mobile: '',
      favicon: '',
      brandName: '',
    },
    socialMedias: {},
    enabledModules: [],
    securitySettings: {
      requireTwoFactorAuth: false,
      passwordComplexity: 1,
      sessionTimeout: 30,
      loginAttemptsLimit: 5,
    },
    paymentConfiguration: {
      currency: 'USD',
      paymentGateway: '',
      apiKey: '',
      sandboxMode: true,
    },
    seoSettings: {
      metaTitle: '',
      metaDescription: '',
      keywords: [''],
      canonicalUrl: '',
    },
    localization: {
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'HH:mm',
      defaultLanguage: 'en',
      supportedLanguages: ['en'],
    },
    analytics: {
      googleAnalyticsId: '',
      trackingPixel: '',
      heatmapEnabled: false,
    },
    customFields: [],
    contactInformation: {
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
    },
  });


          useImperativeHandle(ref, () => ({
            submitForm: () => handleSubmit(onSubmit)()
          }))
      
  

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await axiosInstance.get(`/configurations/${tenantId}`);
        setFormData(data);
      } catch (err) {
        showToast("destructive", "Error!", handleApiError(err))

      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [tenantId]);

  const handleNestedChange = (path: string, value: any) => {
    const keys = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = current[key] || {};
        current = current[key];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Field array handlers
  const addCustomField = () => {
    setFormData(prev => ({
      ...prev,
      customFields: [
        ...(prev.customFields || []),
        { fieldName: '', fieldType: 'text', fieldValue: '' }
      ]
    }));
  };

  const removeCustomField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customFields: (prev.customFields || []).filter((_, i) => i !== index)
    }));
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      enabledModules: [
        ...(prev.enabledModules || []),
        { moduleName: '', isEnabled: false, permissions: [] }
      ]
    }));
  };

  const removeModule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      enabledModules: (prev.enabledModules || []).filter((_, i) => i !== index)
    }));
  };

  const onSubmit = async (data:ConfigFormData) => {
    try {
      setLoading(true);
  const res= await axiosInstance.post(`/configurations`, data);
      showToast("default", "Success!", `${res?.data?.name ?? ''} Successfully Created`)

    } catch (err) {
      showToast("destructive", "Error!", handleApiError(err))
   
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <ScrollArea className="w-full h-full">
      <div className=" mx-auto py-6 gap-2 space-y-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Tenant Configuration</CardTitle>
          </CardHeader>
          <CardContent>
              
              {/* Logos Section */}
              <Card>
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Logos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Desktop Logo URL</Label>
                      <Input
                        type="url"
                        value={formData.logos?.desktop || ''}
                        onChange={(e) => handleNestedChange('logos.desktop', e.target.value)}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mobile Logo URL</Label>
                      <Input
                        type="url"
                        value={formData.logos?.mobile || ''}
                        onChange={(e) => handleNestedChange('logos.mobile', e.target.value)}
                        placeholder="https://example.com/logo-mobile.png"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Favicon URL</Label>
                      <Input
                        type="url"
                        value={formData.logos?.favicon || ''}
                        onChange={(e) => handleNestedChange('logos.favicon', e.target.value)}
                        placeholder="https://example.com/favicon.ico"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Brand Name</Label>
                      <Input
                        value={formData.logos?.brandName || ''}
                        onChange={(e) => handleNestedChange('logos.brandName', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Social Media Section */}
              <Card>
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Social Media</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok'].map((platform) => (
                      <div key={platform} className="space-y-2">
                        <Label>{platform.charAt(0).toUpperCase() + platform.slice(1)} URL</Label>
                        <Input
                          type="url"
                          value={formData.socialMedias?.[platform as keyof typeof formData.socialMedias] || ''}
                          onChange={(e) => handleNestedChange(`socialMedias.${platform}`, e.target.value)}
                          placeholder={`https://${platform}.com/yourpage`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Contact Information Section */}
              <Card>
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.contactInformation?.email || ''}
                        onChange={(e) => handleNestedChange('contactInformation.email', e.target.value)}
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        type="tel"
                        value={formData.contactInformation?.phone || ''}
                        onChange={(e) => handleNestedChange('contactInformation.phone', e.target.value)}
                        placeholder="+1234567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Select
                        value={formData.contactInformation?.country || ''}
                        onValueChange={(value) => handleNestedChange('contactInformation.country', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Postal Code</Label>
                      <Input
                        value={formData.contactInformation?.postalCode || ''}
                        onChange={(e) => handleNestedChange('contactInformation.postalCode', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* SEO Settings Section */}
              <Card>
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">SEO Settings</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Canonical URL</Label>
                      <Input
                        type="url"
                        value={formData.seoSettings?.canonicalUrl || ''}
                        onChange={(e) => handleNestedChange('seoSettings.canonicalUrl', e.target.value)}
                        placeholder="https://example.com/canonical"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Keywords</Label>
                      <Input
  value={Array.isArray(formData.seoSettings?.keywords) 
    ? formData.seoSettings.keywords.join(', ') 
    : ''}
  onChange={(e) => handleNestedChange('seoSettings.keywords', e.target.value.split(/,\s*/))}
  placeholder="keyword1, keyword2, keyword3"
/>



                    </div>
                    </div>
                </div>
              </Card>


              {/* Theme Settings */}
<Card>
  <div className="p-6 space-y-4">
    <h2 className="text-xl font-semibold">Theme Settings</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Primary Color</Label>
        <Input
          type="color"
          value={formData.themeSettings?.primaryColor || '#000000'}
          onChange={(e) => handleNestedChange('themeSettings.primaryColor', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Secondary Color</Label>
        <Input
          type="color"
          value={formData.themeSettings?.secondaryColor || '#000000'}
          onChange={(e) => handleNestedChange('themeSettings.secondaryColor', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Font Family</Label>
        <Select
          value={formData.themeSettings?.fontFamily || 'Arial'}
          onValueChange={(value) => handleNestedChange('themeSettings.fontFamily', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {['Arial', 'Helvetica', 'Times New Roman', 'Roboto'].map((font) => (
              <SelectItem key={font} value={font}>{font}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Switch
          checked={formData.themeSettings?.darkMode || false}
          onCheckedChange={(checked) => handleNestedChange('themeSettings.darkMode', checked)}
        />
        <Label>Dark Mode</Label>
      </div>
    </div>
  </div>
</Card>

{/* Localization */}
<Card>
  <div className="p-6 space-y-4">
    <h2 className="text-xl font-semibold">Localization</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Timezone</Label>
        <Select
          value={formData.localization?.timezone || 'UTC'}
          onValueChange={(value) => handleNestedChange('localization.timezone', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'].map((tz) => (
              <SelectItem key={tz} value={tz}>{tz}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Date Format</Label>
        <Select
          value={formData.localization?.dateFormat || 'MM/DD/YYYY'}
          onValueChange={(value) => handleNestedChange('localization.dateFormat', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select date format" />
          </SelectTrigger>
          <SelectContent>
            {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map((format) => (
              <SelectItem key={format} value={format}>{format}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Time Format</Label>
        <Select
          value={formData.localization?.timeFormat || 'HH:mm'}
          onValueChange={(value) => handleNestedChange('localization.timeFormat', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select time format" />
          </SelectTrigger>
          <SelectContent>
            {['HH:mm', 'hh:mm a', 'HH:mm:ss'].map((format) => (
              <SelectItem key={format} value={format}>{format}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Default Language</Label>
        <Select
          value={formData.localization?.defaultLanguage || 'en'}
          onValueChange={(value) => handleNestedChange('localization.defaultLanguage', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {['en', 'es', 'fr', 'de'].map((lang) => (
              <SelectItem key={lang} value={lang}>{lang.toUpperCase()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Supported Languages</Label>
        <div className="space-y-2">
          <Label>Supported Languages</Label>
          {['en', 'es', 'fr', 'de'].map((lang) => (
            <div key={lang} className="flex items-center space-x-2 p-2">
              <Checkbox
                checked={formData.localization?.supportedLanguages?.includes(lang) || false}
                onCheckedChange={(checked) => {
                  const langs = checked
                    ? [...(formData.localization?.supportedLanguages || []), lang]
                    : (formData.localization?.supportedLanguages || []).filter(l => l !== lang);
                  handleNestedChange('localization.supportedLanguages', langs);
                }}
              />
              <Label>{lang.toUpperCase()}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</Card>

{/* Analytics */}
<Card>
  <div className="p-6 space-y-4">
    <h2 className="text-xl font-semibold">Analytics</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Google Analytics ID</Label>
        <Input
          value={formData.analytics?.googleAnalyticsId || ''}
          onChange={(e) => handleNestedChange('analytics.googleAnalyticsId', e.target.value)}
          placeholder="UA-XXXXX-Y"
        />
      </div>
      <div className="space-y-2">
        <Label>Tracking Pixel URL</Label>
        <Input
          type="url"
          value={formData.analytics?.trackingPixel || ''}
          onChange={(e) => handleNestedChange('analytics.trackingPixel', e.target.value)}
          placeholder="https://example.com/tracking-pixel"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.analytics?.heatmapEnabled || false}
          onCheckedChange={(checked) => handleNestedChange('analytics.heatmapEnabled', checked)}
        />
        <Label>Heatmap Enabled</Label>
      </div>
    </div>
  </div>
</Card>

{/* Custom Fields */}
<Card>
  <div className="p-6 space-y-4">
    <h2 className="text-xl font-semibold">Custom Fields</h2>
    <div className="space-y-4">
      {formData.customFields?.map((field, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label>Field Name</Label>
            <Input
              value={field.fieldName}
              onChange={(e) => handleNestedChange(`customFields.${index}.fieldName`, e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Field Type</Label>
            <Select
              value={field.fieldType}
              onValueChange={(value) => handleNestedChange(`customFields.${index}.fieldType`, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {['text', 'number', 'boolean', 'date'].map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Field Value</Label>
            {field.fieldType === 'boolean' ? (
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  checked={field.fieldValue}
                  onCheckedChange={(checked) => handleNestedChange(`customFields.${index}.fieldValue`, checked)}
                />
                <Label>{field.fieldValue ? 'True' : 'False'}</Label>
              </div>
            ) : (
              <Input
                type={field.fieldType === 'date' ? 'date' : field.fieldType === 'number' ? 'number' : 'text'}
                value={field.fieldValue}
                onChange={(e) => handleNestedChange(`customFields.${index}.fieldValue`, e.target.value)}
              />
            )}
          </div>
          <Button
            type="button"
            onClick={() => removeCustomField(index)}
            variant="destructive"
            className="w-full md:w-auto"
          >
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" onClick={addCustomField} variant="outline">
        Add Custom Field
      </Button>
    </div>
  </div>
</Card>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Save Configuration'}
              </Button>
            {/* </form> */}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
})