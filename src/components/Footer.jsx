function LinkedinIcon(props) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="currentColor"
            {...props}
        >
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
        </svg>
    );
}

function GithubIcon(props) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="currentColor"
            {...props}
        >
            <path d="M12 2C6.48 2 2 6.58 2 12.17c0 4.49 2.87 8.3 6.84 9.65.5.1.68-.22.68-.49 0-.24-.01-1.03-.01-1.87-2.78.51-3.5-.7-3.72-1.34-.13-.32-.67-1.34-1.15-1.61-.39-.21-.95-.73-.01-.75.88-.01 1.51.82 1.72 1.16 1 1.7 2.6 1.22 3.23.93.1-.73.39-1.22.71-1.5-2.49-.29-5.1-1.27-5.1-5.63 0-1.24.44-2.26 1.16-3.05-.12-.29-.5-1.46.11-3.04 0 0 .95-.31 3.12 1.16a10.4 10.4 0 0 1 5.68 0c2.17-1.48 3.12-1.16 3.12-1.16.61 1.58.23 2.75.11 3.04.72.79 1.16 1.8 1.16 3.05 0 4.37-2.62 5.34-5.11 5.62.4.35.76 1.05.76 2.11 0 1.53-.01 2.76-.01 3.14 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.17C22 6.58 17.52 2 12 2Z" />
        </svg>
    );
}

function MailIcon(props) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 6-10 7L2 6" />
        </svg>
    );
}

export default function Footer() {
    const year = new Date().getFullYear();

    const links = [
        {
            label: 'LinkedIn',
            href: 'https://www.linkedin.com/in/mohamed-gehad-767a18390',
            Icon: LinkedinIcon,
        },
        {
            label: 'GitHub',
            href: 'https://github.com/NARUT06',
            Icon: GithubIcon,
        },
        { label: 'Email', href: 'mailto:jhad16358@gmail.com', Icon: MailIcon },
    ];

    return (
        <footer className="mt-auto py-8 px-4 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                    {links.map(({ label, href, Icon }) => (
                        <a
                            key={label}
                            href={href}
                            target={label !== 'Email' ? '_blank' : undefined}
                            rel={
                                label !== 'Email'
                                    ? 'noopener noreferrer'
                                    : undefined
                            }
                            aria-label={label}
                            className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/40 dark:hover:text-violet-300 flex items-center justify-center transition-colors"
                        >
                            <Icon />
                        </a>
                    ))}
                </div>

                <p className="text-sm text-slate-400 dark:text-slate-500">
                    © {year} Mohamed Gehad. جميع الحقوق محفوظة.
                </p>
            </div>
        </footer>
    );
}
