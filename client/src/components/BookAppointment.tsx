import { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Stethoscope,
  CheckCircle2,
  Video,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppointments } from '@/hooks/use-appointments';
import { useDoctors } from '@/hooks/use-doctors';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/store/LanguageContext';

interface BookAppointmentProps {
  open: boolean;
  onClose: () => void;
}

export default function BookAppointment({ open, onClose }: BookAppointmentProps) {
  const { language, t } = useLanguage();
  const { bookAppointment } = useAppointments('patient');
  const { doctors } = useDoctors();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    doctor: string;
    phone: string;
    date: string;
    time: string;
    reason: string;
    mode: 'Video' | 'In-clinic';
    spec: string;
  }>({
    doctor: '',
    phone: '',
    date: '',
    time: '',
    reason: '',
    mode: 'Video',
    spec: 'General Practice',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctor || !formData.phone || !formData.date || !formData.time || !formData.reason || !formData.spec) {
      toast.error(language === 'hi' ? 'सभी आवश्यक फील्ड भरें' : 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const fullDate = `${formData.date} at ${formData.time}`;
      await bookAppointment({
        doctor: formData.doctor,
        phone: formData.phone,
        date: fullDate,
        reason: formData.reason,
        mode: formData.mode,
        spec: formData.spec,
      });
      toast.success(language === 'hi' ? 'अपॉइंटमेंट सफलतापूर्वक बुक हो गया!' : 'Appointment booked successfully!');
      setFormData({
        doctor: '',
        phone: '',
        date: '',
        time: '',
        reason: '',
        mode: 'Video',
        spec: 'General Practice',
      });
      onClose();
    } catch (error: any) {
      toast.error(error.message || (language === 'hi' ? 'अपॉइंटमेंट बुक करने में असफल' : 'Failed to book appointment'));
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctors.find(d => d._id === formData.doctor);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-[95vw]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl font-display">
              <Calendar className="h-5 w-5 text-primary" />
              {language === 'hi' ? 'अपॉइंटमेंट बुक करें' : 'Book an Appointment'}
            </DialogTitle>
          </div>
          <DialogDescription>
            {language === 'hi' ? 'अपने अपॉइंटमेंट के लिए डॉक्टर, दिनांक और समय चुनें।' : 'Select a doctor, date, and time for your appointment.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{language === 'hi' ? 'डॉक्टर चुनें' : 'Select Doctor'}</Label>
            <Select
              value={formData.doctor}
              onValueChange={(val) => {
                const doc = doctors.find(d => d._id === val);
                setFormData({
                  ...formData,
                  doctor: val,
                  spec: doc?.specialization || 'General Practice',
                });
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={language === 'hi' ? 'डॉक्टर चुनें' : 'Select a doctor'} />
              </SelectTrigger>
              <SelectContent>
                {doctors.length === 0 ? (
                  <SelectItem value="none" disabled>{language === 'hi' ? 'कोई डॉक्टर उपलब्ध नहीं' : 'No doctors available'}</SelectItem>
                ) : (
                  doctors.map((doctor) => (
                    <SelectItem key={doctor._id} value={doctor._id}>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        {doctor.name} - {doctor.specialization || 'General Practice'}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedDoctor && (
            <div className="grid gap-2 rounded-xl bg-secondary/50 p-3 text-sm">
              <div className="font-medium">{selectedDoctor.name}</div>
              <div className="text-xs text-muted-foreground">
                {selectedDoctor.specialization || 'General Practice'}
              </div>
            </div>
          )}

          <div>
            <Label>{language === 'hi' ? 'फोन नंबर' : 'Phone Number'}</Label>
            <Input
              type="tel"
              className="mt-1"
              placeholder={language === 'hi' ? 'अपना फोन नंबर दर्ज करें' : 'Enter your phone number'}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>{language === 'hi' ? 'दिनांक' : 'Date'}</Label>
              <Input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="mt-1"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>{language === 'hi' ? 'समय' : 'Time'}</Label>
              <Input
                type="time"
                className="mt-1"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label>{language === 'hi' ? 'अपॉइंटमेंट का तरीका' : 'Appointment Mode'}</Label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mode: 'Video' })}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 transition ${
                  formData.mode === 'Video'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'hover:bg-secondary'
                }`}
              >
                <Video className="h-4 w-4" />
                <span className="text-sm font-medium">{language === 'hi' ? 'वीडियो कॉल' : 'Video Call'}</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mode: 'In-clinic' })}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 transition ${
                  formData.mode === 'In-clinic'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'hover:bg-secondary'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">{language === 'hi' ? 'क्लिनिक में' : 'In-clinic'}</span>
              </button>
            </div>
          </div>

          <div>
            <Label>{language === 'hi' ? 'अपॉइंटमेंट का कारण' : 'Reason for Appointment'}</Label>
            <Textarea
              placeholder={language === 'hi' ? 'अपने लक्षणों या आने का कारण बताएं...' : 'Describe your symptoms or reason for the visit...'}
              className="mt-1"
              rows={3}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-hero text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {language === 'hi' ? 'बुक कर रहे हैं...' : 'Booking...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {language === 'hi' ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
