import { Activity, Github, Twitter, Linkedin, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-soft">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-hero text-white">
              <Activity className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold">Shiv Shakti Medical Healthcare</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Smart Clinic Management for patients, doctors and administrators — all in one calm,
            connected platform.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Kond, Block-Ghraunda, District-Karnal, Haryana</span>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/patient">Patient portal</Link></li>
            <li><Link to="/doctor">Doctor portal</Link></li>
            <li><Link to="/admin">Admin console</Link></li>
            <li><Link to="/patient/assistant">AI Health Assistant</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About</li><li>Careers</li><li>Privacy</li><li>Terms</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Follow</h4>
          <div className="flex gap-3">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border hover:bg-primary hover:text-primary-foreground transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border/50 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Shiv Shakti Medical Healthcare · Built with care.
      </div>
    </footer>
  );
}
