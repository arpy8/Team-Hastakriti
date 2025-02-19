import Link from 'next/link';

const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Why Us", href: "/why-us" },
    { name: "Research", href: "/research" },
    { name: "Gallery", href: "/gallery" },
    { name: "Team", href: "/team" },
    { name: "Contact", href: "/contact" },
];

interface NavbarProps {
    fade: boolean;
}

export default function Navbar({ fade }: NavbarProps) {
    return (
        <nav className={`absolute top-6 left-0 w-full ${fade ? 'animate-fade-in' : ''}`}>
            <ul className="flex items-center justify-center gap-8 py-4">
                {navigation.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="text-sm duration-500 text-zinc-500 hover:text-[#6dd1c5]"
                    >
                        {item.name}
                    </Link>
                ))}
            </ul>
        </nav>
    );
}