
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Database, ServerCog } from "lucide-react";
import MicrosoftIcon from "@/components/icons/MicrosoftIcon";

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MicrosoftIcon className="h-8 w-8" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg text-slate-900">Microsoft AI Agent Monitor</h1>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                DEMO MODE
              </Badge>
            </div>
            <div className="flex items-center text-xs text-slate-500 gap-2">
              <ServerCog className="h-3 w-3" /> Java Enterprise Platform
              <Database className="h-3 w-3 ml-1" /> Azure AI Integration
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Java Spring Monitor
          </Button>
          
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>MS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
