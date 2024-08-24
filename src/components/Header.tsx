interface HeaderProps {
  title: string;
  description: string;
}

const Header = ({ title, description }: HeaderProps) => (
  <div className="space-y-2">
    <h4 className="font-medium">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Header;
