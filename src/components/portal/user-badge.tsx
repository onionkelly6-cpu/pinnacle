function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserBadge({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-border bg-card py-1 pl-1 pr-3">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 font-display text-[10px] text-primary">
        {getInitials(name)}
      </span>
      <span className="text-xs">
        {name}
        <span className="ml-1.5 text-muted-foreground">&middot; {role}</span>
      </span>
    </div>
  );
}
