        const { useState, useEffect, useRef } = React;
        const h = React.createElement;

        const SEARCH_ENGINES = {
            ecosia: {
                name: 'Ecosia',
                url: 'https://www.ecosia.org/search',
                queryParam: 'q',
                icon: 'https://www.google.com/s2/favicons?domain=ecosia.org&sz=64',
                description: "The search engine that plants trees while you search.",
                details: "Ecosia uses its ad revenue to fund reforestation projects globally. By searching with Ecosia, you help restore landscapes and support local communities, essentially turning your digital footprint into trees.",
                ecoStatus: 'green'
            },
            google: {
                name: 'Google',
                url: 'https://www.google.com/search',
                queryParam: 'q',
                icon: 'https://www.google.com/s2/favicons?domain=google.com&sz=64',
                description: "The world's most popular search engine.",
                details: "Google provides the most comprehensive and powerful search index. While widely used, it is often critiqued for data tracking, though it remains the gold standard for finding information quickly.",
                ecoStatus: 'amber'
            },
            bing: {
                name: 'Bing',
                url: 'https://www.bing.com/search',
                queryParam: 'q',
                icon: 'https://www.google.com/s2/favicons?domain=bing.com&sz=64',
                description: "Microsoft's search experience with rich visual results.",
                details: "Bing combines core search capabilities with AI integration and beautiful daily imagery. It powers many other environmental search engines as a backend provider.",
                ecoStatus: 'red'
            },
            duckduckgo: {
                name: 'DuckDuckGo',
                url: 'https://duckduckgo.com',
                queryParam: 'q',
                icon: 'https://www.google.com/s2/favicons?domain=duckduckgo.com&sz=64',
                description: "Privacy-focused search that doesn't track you.",
                details: "DuckDuckGo is the leading advocate for private search. It doesn't store your history or personal info, offering a 'filter-bubble' free experience where everyone gets the same results.",
                ecoStatus: 'amber'
            },
            brave: {
                name: 'Brave Search',
                url: 'https://search.brave.com/search',
                queryParam: 'q',
                icon: 'https://www.google.com/s2/favicons?domain=search.brave.com&sz=64',
                description: "Independent, private, and user-first search.",
                details: "Brave Search is built on an independent index, meaning it doesn't rely on Big Tech for its results. It offers a transparent and private alternative to conventional search engines.",
                ecoStatus: 'amber'
            },
            startpage: {
                name: 'Startpage',
                url: 'https://www.startpage.com/do/dsearch',
                queryParam: 'query',
                icon: 'https://www.google.com/s2/favicons?domain=startpage.com&sz=64',
                description: "Google's results with total privacy protection.",
                details: "Startpage allows you to use Google's high-quality search results without Google tracking you. It acts as a middleman, stripping away personal identifiers before querying Google.",
                ecoStatus: 'green'
            },
            qwant: {
                name: 'Qwant',
                url: 'https://www.qwant.com/',
                queryParam: 'q',
                icon: 'https://www.google.com/s2/favicons?domain=qwant.com&sz=64',
                description: "The European search engine that respects your privacy.",
                details: "Based in France, Qwant guarantees it doesn't install cookies or track users. It strictly adheres to European privacy laws and focuses on delivering neutral search results.",
                ecoStatus: 'amber'
            },
            swisscows: {
                name: 'Swisscows',
                url: 'https://swisscows.com/web',
                queryParam: 'query',
                icon: 'https://www.google.com/s2/favicons?domain=swisscows.com&sz=64',
                description: "Anonymous search engine from Switzerland.",
                details: "Swisscows uses its own semantic search technology to deliver anonymous results. They do not store any data and operate out of Switzerland, known for its strong privacy protections.",
                ecoStatus: 'green'
            }
        };

        // Lucide Icons Helper Component
        const Icon = ({ name, className = "w-5 h-5" }) => {
            const containerRef = useRef(null);
            
            useEffect(() => {
                if (containerRef.current) {
                    containerRef.current.innerHTML = `<i data-lucide="${name}"></i>`;
                    lucide.createIcons({
                        attrs: { class: className },
                        nameAttr: 'data-lucide',
                        icons: { [name]: lucide[name] },
                        root: containerRef.current
                    });
                }
            }, [name, className]);

            return h('span', { 
                ref: containerRef, 
                className: "inline-flex items-center justify-center", 
                "aria-hidden": "true" 
            });
        };

        function App() {
            // --- State Persistence ---
            const [query, setQuery] = useState('');
            const [engine, setEngine] = useState(() => {
                const savedEngine = localStorage.getItem('gm-engine');
                return (savedEngine && SEARCH_ENGINES[savedEngine]) ? savedEngine : 'ecosia';
            });
            const [darkMode, setDarkMode] = useState(() => {
                return localStorage.getItem('gm-dark-mode') === 'true' || 
                       (!('gm-dark-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
            });
            const [dyslexiaMode, setDyslexiaMode] = useState(() => localStorage.getItem('gm-dyslexia-mode') === 'true');
            const [cookiesAccepted, setCookiesAccepted] = useState(() => localStorage.getItem('gm-cookies-accepted') === 'true');
            const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
            
            // --- UI State ---
            const [isSettingsOpen, setIsSettingsOpen] = useState(false);
            const [isDropdownOpen, setIsDropdownOpen] = useState(false);
            const [expandedEngineKey, setExpandedEngineKey] = useState(null);
            const dropdownRef = useRef(null);
            const searchInputRef = useRef(null);

            // --- Handlers ---
            useEffect(() => {
                localStorage.setItem('gm-engine', engine);
            }, [engine]);

            useEffect(() => {
                localStorage.setItem('gm-cookies-accepted', cookiesAccepted);
            }, [cookiesAccepted]);

            useEffect(() => {
                localStorage.setItem('gm-dyslexia-mode', dyslexiaMode);
                if (dyslexiaMode) {
                    document.body.classList.add('dyslexia-mode');
                } else {
                    document.body.classList.remove('dyslexia-mode');
                }
            }, [dyslexiaMode]);

            useEffect(() => {
                localStorage.setItem('gm-dark-mode', darkMode);
                
                const html = document.documentElement;
                
                if (darkMode) {
                    html.classList.add('dark');
                    html.style.colorScheme = 'dark';
                } else {
                    html.classList.remove('dark');
                    html.style.colorScheme = 'light';
                }

                // Sync Meta Theme Color for mobile status bars
                const themeColor = darkMode ? '#020617' : '#f8fafc';
                let metaTheme = document.querySelector('meta[name="theme-color"]');
                if (!metaTheme) {
                    metaTheme = document.createElement('meta');
                    metaTheme.setAttribute('name', 'theme-color');
                    document.head.appendChild(metaTheme);
                }
                metaTheme.setAttribute('content', themeColor);
            }, [darkMode]);

            useEffect(() => {
                const handleClickOutside = (event) => {
                    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                        setIsDropdownOpen(false);
                    }
                };
                document.addEventListener('mousedown', handleClickOutside);
                return () => document.removeEventListener('mousedown', handleClickOutside);
            }, []);

            const handleSearch = (e) => {
                e?.preventDefault();
                if (!query.trim()) return;

                const searchUrl = `${currentEngine.url}?${currentEngine.queryParam}=${encodeURIComponent(query)}`;
                window.open(searchUrl, '_blank');
            };

            const clearSearch = () => {
                setQuery('');
                if (searchInputRef.current) searchInputRef.current.focus();
            };

            const currentEngine = SEARCH_ENGINES[engine] || SEARCH_ENGINES.ecosia;

            return h('div', { className: "flex flex-col min-h-screen relative overflow-x-hidden" }, [
                h('header', { 
                    key: 'header',
                    className: "bg-black border-b border-white/5" 
                }, [
                    h('nav', {
                        className: "max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center bg-black"
                    }, [
                        h('div', { key: 'logo', className: "flex items-center shrink min-w-0 group cursor-pointer", onClick: () => window.location.href = '/' }, [
                            h('div', { 
                                className: "w-10 h-10 overflow-hidden rounded-full border border-white/10 shadow-[0_0_8px_rgba(24,131,43,0.3)] shrink-0 flex items-center justify-center bg-black/50 group-hover:scale-105 transition-transform duration-300",
                                "aria-hidden": "true"
                            }, 
                                h('img', { src: "/favicon-square.svg", alt: "GreenMeans Logo", className: "w-full h-full object-cover rounded-full" })
                            ),
                            h('span', { className: "text-xl font-light tracking-wide text-white shrink ml-4 group-hover:text-[#18832b] transition-colors duration-300" }, "GreenMeans")
                        ]),
                        h('div', { key: 'nav', className: "flex items-center gap-3 shrink-0" }, [
                            h('a', { 
                                href: "https://greenmeans.ovh",
                                className: "flex items-center justify-center px-4 sm:px-5 py-2 text-xs font-medium uppercase tracking-widest text-white/70 border border-white/10 rounded-full hover:text-white hover:border-[#18832b] hover:bg-[#18832b]/10 hover:shadow-[0_0_15px_rgba(24,131,43,0.3)] transition-all duration-300 backdrop-blur-sm",
                                "aria-label": "Home"
                            }, [
                                h(Icon, { name: "Home", className: "w-4 h-4 sm:mr-2" }),
                                h('span', { className: "hidden sm:inline" }, "Home")
                            ]),
                            h('button', { 
                                onClick: () => setIsSettingsOpen(true),
                                className: "flex items-center justify-center px-4 sm:px-5 py-2 text-xs font-medium uppercase tracking-widest text-white/70 border border-white/10 rounded-full hover:text-white hover:border-[#18832b] hover:bg-[#18832b]/10 hover:shadow-[0_0_15px_rgba(24,131,43,0.3)] transition-all duration-300 backdrop-blur-sm",
                                "aria-label": "Settings"
                            }, [
                                h(Icon, { name: "Settings", className: "w-4 h-4 sm:mr-2" }),
                                h('span', { className: "hidden sm:inline" }, "Settings")
                            ])
                        ])
                    ])
                ]),
                
                h('main', { 
                    key: 'main',
                    className: "flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-16 md:py-24 relative w-full max-w-7xl mx-auto" 
                }, [
                    h('div', { key: 'bg-blobs', className: "absolute inset-0 overflow-hidden pointer-events-none opacity-20" }, [
                        h('div', { key: 'blob1', className: "absolute inset-0 m-auto w-[40rem] h-[40rem] bg-[#18832b]/20 rounded-full -translate-x-1/3 -translate-y-1/4 blur-3xl mix-blend-screen" }),
                        h('div', { key: 'blob2', className: "absolute inset-0 m-auto w-[40rem] h-[40rem] bg-[#3d984e]/20 rounded-full translate-x-1/3 translate-y-1/4 blur-3xl mix-blend-screen" }),
                    ]),
                    
                    h('div', { key: 'content', className: "w-full flex flex-col items-center gap-10 sm:gap-12 z-10" }, [
                        h('div', { className: "text-center animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl px-2" }, [
                            h('h2', { className: "text-5xl md:text-5xl lg:text-6xl font-light tracking-tighter mb-4 text-white leading-[1.15]" }, [
                                "Discover a ",
                                h('span', { 
                                    key: 'highlight', 
                                    className: `text-transparent bg-clip-text bg-gradient-to-r inline-block transition-all duration-500 ${
                                        currentEngine.ecoStatus === 'green' 
                                            ? 'from-[#18832b] to-[#3d984e]' 
                                            : currentEngine.ecoStatus === 'amber'
                                                ? 'from-amber-400 to-orange-600'
                                                : 'from-red-500 to-rose-700'
                                    }` 
                                }, "Greener"),
                                " way to Search."
                            ]),
                            h('p', { className: "text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-xl mx-auto" }, 
                                "Pick your search provider and help restore the web’s natural balance."
                            )
                        ]),
                        
                        // Search Component
                        h('div', { className: "w-full max-w-3xl relative group" }, [
                            h('form', { 
                                onSubmit: handleSearch,
                                role: "search",
                                className: "relative flex items-center bg-zinc-900/40 rounded-[2rem] p-1.5 sm:p-2 border border-white/10 transition-all focus-within:border-[#18832b] focus-within:ring-4 focus-within:ring-[#18832b]/10 focus-within:shadow-[0_0_20px_rgba(24,131,43,0.1)] w-full"
                            }, [
                                h('div', { key: 'dropdown', className: "relative shrink-0", ref: dropdownRef }, [
                                    h('button', { 
                                        type: "button",
                                        onClick: () => setIsDropdownOpen(!isDropdownOpen),
                                        "aria-haspopup": "listbox",
                                        "aria-expanded": isDropdownOpen,
                                        "aria-label": `Change search engine (current: ${currentEngine.name})`,
                                        className: "flex items-center gap-2 sm:gap-3 pl-3 pr-2 sm:pl-4 sm:pr-3 py-2.5 sm:py-3 rounded-[1.5rem] hover:bg-white/5 transition-colors text-white font-medium whitespace-nowrap"
                                    }, [
                                        h('div', { className: "w-8 h-8 flex items-center justify-center bg-black/50 rounded-full overflow-hidden shadow-sm border border-white/10 shrink-0", "aria-hidden": "true" }, 
                                            h('img', { src: currentEngine.icon, alt: `${currentEngine.name} search engine icon`, className: "w-full h-full object-cover" })
                                        ),
                                        h('span', { className: "hidden xs:inline text-sm sm:text-base font-light" }, currentEngine.name),
                                        h(Icon, { name: "ChevronDown", className: `w-4 h-4 text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}` })
                                    ]),
                                    isDropdownOpen && h('div', { 
                                        role: "listbox",
                                        className: "absolute left-0 top-full mt-3 w-72 sm:w-80 bg-zinc-950 border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[60vh] z-50 p-2 animate-in fade-in zoom-in-95 origin-top-left" 
                                    }, 
                                        Object.entries(SEARCH_ENGINES).map(([key, info]) => {
                                            const isExpanded = expandedEngineKey === key;
                                            const isSelected = engine === key;
                                            
                                            // Split layout property: icon border-white/10 with subtle grouping
                                            return h('div', { 
                                                key,
                                                className: `group/item w-full flex flex-col rounded-xl transition-all mb-1 last:mb-0 border ${isSelected ? 'bg-[#18832b]/20 border-[#18832b]' : 'hover:bg-zinc-900 border-transparent'}`
                                            }, [
                                                h('div', { className: "flex items-center gap-3 p-2" }, [
                                                    h('button', { 
                                                        type: 'button',
                                                        role: "option",
                                                        "aria-selected": isSelected,
                                                        onClick: () => {
                                                            setEngine(key);
                                                            setIsDropdownOpen(false);
                                                        },
                                                        className: "flex-1 flex items-center gap-4 text-left group/btn min-w-0"
                                                    }, [
                                                        h('div', { 
                                                            key: 'icon', 
                                                            className: `w-10 h-10 shrink-0 flex items-center justify-center rounded-full border transition-all ${isSelected ? 'bg-[#18832b] border-[#18832b] text-white shadow-[0_0_10px_rgba(24,131,43,0.4)]' : 'bg-white/5 border-white/10 text-white/80 group-hover/btn:bg-[#18832b] group-hover/btn:border-[#18832b] group-hover/btn:text-white'}`, 
                                                            "aria-hidden": "true" 
                                                        }, 
                                                            h('img', { 
                                                                src: info.icon, 
                                                                alt: `${info.name} icon`, 
                                                                className: "w-6 h-6 object-cover rounded-full" 
                                                            })
                                                        ),
                                                        h('div', { key: 'text', className: "min-w-0 flex-1" }, [
                                                            h('div', { className: `font-medium text-sm sm:text-base ${isSelected ? 'text-white' : 'text-zinc-100'}` }, info.name),
                                                            h('div', { 
                                                                className: `text-xs opacity-80 mt-0.5 truncate font-light ${isSelected ? 'text-zinc-200' : 'text-zinc-400'}`,
                                                                title: info.description
                                                            }, info.description)
                                                        ])
                                                    ]),
                                                    h('button', {
                                                        type: 'button',
                                                        onClick: (e) => {
                                                            e.stopPropagation();
                                                            setExpandedEngineKey(isExpanded ? null : key);
                                                        },
                                                        className: `w-8 h-8 shrink-0 flex items-center justify-center rounded-full transition-all ${isExpanded ? 'bg-[#18832b] text-white shadow-[0_0_8px_rgba(24,131,43,0.4)] rotate-180 border border-[#18832b]' : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10'}`,
                                                        "aria-label": isExpanded ? "Show less info" : "Show more info"
                                                    }, h(Icon, { name: isExpanded ? "ChevronUp" : "Info", className: "w-4 h-4" }))
                                                ]),
                                                isExpanded && h('div', { 
                                                    className: "px-3 pb-3 pt-1 animate-in slide-in-from-top-2 duration-200" 
                                                }, [
                                                    h('div', { className: "text-xs font-light leading-relaxed text-zinc-400 p-3 bg-black/40 rounded-lg border border-white/5 shadow-inner" }, info.details)
                                                ])
                                            ]);
                                        })
                                    )
                                ]),
                                
                                h('div', { className: "w-px h-8 bg-white/10 mx-1 shrink-0" }),

                                h('input', { 
                                    key: 'input',
                                    ref: searchInputRef,
                                    type: "text", 
                                    value: query,
                                    onChange: (e) => setQuery(e.target.value),
                                    placeholder: `Search the web...`,
                                    "aria-label": `Search input for ${currentEngine.name}`,
                                    // text-[16px] is critical: it prevents iOS Safari from automatically zooming the page!
                                    className: "flex-1 min-w-0 bg-transparent border-none outline-none px-3 sm:px-4 py-3 sm:py-4 text-[16px] sm:text-lg font-light text-white placeholder:text-zinc-500"
                                }),
                                
                                query.length > 0 && h('button', {
                                    key: 'clear',
                                    type: "button",
                                    onClick: clearSearch,
                                    className: "p-2 mr-1 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none active:scale-90",
                                    "aria-label": "Clear search query"
                                }, h(Icon, { name: "X", className: "w-4 h-4 sm:w-5 sm:h-5" })),

                                h('button', { 
                                    key: 'submit',
                                    type: "submit",
                                    className: "bg-[#18832b] hover:bg-[#3d984e] text-white p-3.5 sm:p-4 rounded-[1.25rem] transition-all shadow-[0_0_15px_rgba(24,131,43,0.3)] active:scale-95 flex items-center justify-center focus:ring-2 focus:ring-[#18832b] outline-none shrink-0",
                                    "aria-label": "Submit Search"
                                }, h(Icon, { name: "Search", className: "w-5 h-5 sm:w-6 sm:h-6" }))
                            ]),
                            
                            h('div', { key: 'status', className: "mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-widest" }, [
                                h('div', { className: "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-zinc-900/40 rounded-full border border-white/10" }, [
                                    h('img', { src: currentEngine.icon, alt: `${currentEngine.name} active provider icon`, className: "w-3 h-3 object-cover rounded-full filter brightness-90 saturate-150" }),
                                    h('span', null, `Active Provider: ${currentEngine.name}`)
                                ]),
                                h('div', { 
                                    className: `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border transition-colors duration-500 ${
                                        currentEngine.ecoStatus === 'green' 
                                            ? 'bg-[#18832b]/10 border-[#18832b]/30 text-emerald-400' 
                                            : currentEngine.ecoStatus === 'amber'
                                                ? 'bg-amber-900/20 border-amber-800/30 text-amber-400'
                                                : 'bg-red-900/20 border-red-800/30 text-red-500'
                                    }` 
                                }, [
                                    h('div', { 
                                        className: `w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${
                                            currentEngine.ecoStatus === 'green' 
                                                ? 'bg-[#18832b]' 
                                                : currentEngine.ecoStatus === 'amber'
                                                    ? 'bg-amber-500'
                                                    : 'bg-red-500'
                                        }` 
                                    }),
                                    h('span', null, currentEngine.ecoStatus === 'red' ? "Non-Eco-Friendly Platform" : "Eco-Friendly Platform")
                                ])
                            ])
                        ])
                    ])
                ]),
                
                h('footer', { key: 'footer', className: "text-center text-slate-400 text-xs sm:text-sm p-6 mt-auto" }, 
                    h('p', null, `© ${new Date().getFullYear()} GreenMeans: Search. All results provided by ${currentEngine.name}`)
                ),

                // Modals & Banners Layer
                
                // Settings Modal
                isSettingsOpen && h('div', { key: 'modal', className: "fixed inset-0 z-[60] flex items-center justify-center px-4" }, [
                    h('div', { className: "absolute inset-0 bg-black/80 backdrop-blur-sm", onClick: () => setIsSettingsOpen(false) }),
                    h('div', { className: "bg-zinc-950 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-md overflow-hidden z-20 border border-white/10 animate-in fade-in zoom-in-95 duration-200" }, [
                        h('div', { className: "p-6 sm:p-8 border-b border-white/5 flex justify-between items-center bg-black/50" }, [
                            h('h3', { className: "text-xl sm:text-2xl font-light flex items-center gap-3 text-white" }, [
                                h(Icon, { name: "Settings", className: "w-6 h-6 text-[#18832b]" }),
                                "Settings"
                            ]),
                            h('button', { 
                                onClick: () => setIsSettingsOpen(false),
                                className: "p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400",
                                "aria-label": "Close settings"
                            }, h(Icon, { name: "X", className: "w-5 h-5" }))
                        ]),
                        h('div', { className: "p-6 sm:p-8 space-y-6" }, [
                            h('section', null, [
                                h('h4', { className: "text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4" }, "Accessibility & Style"),
                                h('div', { className: "space-y-3 sm:space-y-4" }, [
                                    [
                                        { name: "Dyslexia Friendly Font", icon: "Type", active: dyslexiaMode, toggle: () => setDyslexiaMode(!dyslexiaMode), subtitle: "Lexend for better readability" }
                                    ].map((opt, i) => 
                                        h('div', { key: i, className: "flex items-center justify-between p-4 bg-white/5 rounded-2xl" }, [
                                            h('div', { className: "flex items-center gap-3 text-zinc-300" }, [
                                                h(Icon, { name: opt.icon, className: "w-5 h-5 shrink-0 text-[#18832b]" }),
                                                h('div', { className: "flex flex-col relative top-px" }, [
                                                    h('span', { className: "font-medium text-sm sm:text-base" + (opt.subtitle ? " leading-none" : "") }, opt.name),
                                                    opt.subtitle && h('span', { className: "text-[10px] sm:text-xs text-zinc-500 font-light mt-0.5" }, opt.subtitle)
                                                ])
                                            ]),
                                            h('button', { 
                                                onClick: opt.toggle,
                                                role: "switch",
                                                type: "button",
                                                "aria-checked": opt.active,
                                                "aria-label": `Toggle ${opt.name}`,
                                                className: `w-12 h-6 rounded-full transition-colors relative shrink-0 ${opt.active ? 'bg-[#18832b]' : 'bg-zinc-700'}`
                                            }, h('div', { className: `absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${opt.active ? 'left-7' : 'left-1'}` }))
                                        ])
                                    )
                                ])
                            ])
                        ]),
                        h('div', { className: "p-6 sm:p-8 bg-black/50 text-center border-t border-white/5" }, 
                            h('p', { className: "text-xs font-light text-zinc-500" }, "Your preferences are saved locally on this device.")
                        )
                    ])
                ]),

                // Decline modal
                isDeclineModalOpen && h('div', { key: 'decline-modal', className: "fixed inset-0 z-[110] flex items-center justify-center px-4 animate-in fade-in duration-300" }, [
                    h('div', { className: "absolute inset-0 bg-black/80 backdrop-blur-sm" }),
                    h('div', { className: "bg-zinc-950 rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden z-20 border border-white/10 p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200" }, [
                        h('div', { className: "w-16 h-16 bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6 border border-amber-500/20" }, 
                            h(Icon, { name: "AlertTriangle", className: "w-8 h-8" })
                        ),
                        h('h3', { className: "text-xl font-light mb-3 text-white tracking-wide" }, "Cookie Consent Declined"),
                        h('p', { className: "text-zinc-400 font-light text-sm mb-8 leading-relaxed" }, 
                            "By declining non-essential cookies, some features of this website might not function as expected."
                        ),
                        h('button', { 
                            onClick: () => {
                                setIsDeclineModalOpen(false);
                                setCookiesAccepted(true); // Treat "Understood" as completing the interaction
                            },
                            className: "w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-black/50"
                        }, "Understood")
                    ])
                ]),

                // Fixed Cookie Banner overlay over the bottom of the viewport
                !cookiesAccepted && h('div', { 
                    key: 'cookie-banner', 
                    // Use a slightly varied wrapper to ensure it sticks purely to viewport bottom regardless of scrolling state
                    className: "fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom-full duration-500" 
                }, [
                    h('div', { 
                        // The pb-[max(env(safe-area-inset-bottom),1rem)] ensures iPhone bottom bar does not hide buttons
                        className: "w-full bg-black border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-4 md:p-6 pb-[max(env(safe-area-inset-bottom),1rem)] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 mx-auto xl:px-32" 
                    }, [
                        h('div', { className: "flex items-center gap-4 max-w-4xl" }, [
                            h('div', { className: "w-10 h-10 bg-[#18832b]/20 rounded-xl flex items-center justify-center border border-[#18832b]/30 text-[#18832b] shrink-0" }, 
                                h(Icon, { name: "Cookie", className: "w-5 h-5" })
                            ),
                            h('p', { className: "text-sm text-zinc-400 font-light leading-relaxed" }, [
                                "We use cookies to ensure you get the best experience on our website. Read our ",
                                h('a', { 
                                    href: "https://privacy.greenmeans.ovh/", 
                                    target: "_blank", 
                                    rel: "noopener noreferrer",
                                    className: "text-[#18832b] font-medium hover:text-[#3d984e] hover:underline transition-colors" 
                                }, "Privacy Policy"),
                                "."
                            ])
                        ]),
                        h('div', { className: "flex items-center gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0" }, [
                            h('button', { 
                                onClick: () => setIsDeclineModalOpen(true),
                                className: "flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 rounded-xl font-medium transition-all active:scale-95 whitespace-nowrap"
                            }, "Decline"),
                            h('button', { 
                                onClick: () => setCookiesAccepted(true),
                                className: "flex-1 md:flex-none px-6 py-3 bg-[#18832b] hover:bg-[#3d984e] text-white rounded-xl font-medium transition-all active:scale-95 whitespace-nowrap shadow-[0_0_15px_rgba(24,131,43,0.3)]"
                            }, "Accept")
                        ])
                    ])
                ])
            ]);
        }

        const rootLayout = document.getElementById('root');
        const root = ReactDOM.createRoot(rootLayout);
        root.render(h(App));
