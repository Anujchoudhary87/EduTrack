export const BOOKS = [
    {
      id: "mastering-react",
      title: "Mastering React & Next.js",
      description: "A comprehensive guide to building high-performance web applications.",
      chapters: [
        {
          id: "intro-nextjs",
          title: "Introduction to Next.js",
          content: [
            { id: "what-is-nextjs", type: "video", videoId: "video_1", title: "What is Next.js?", videoUrl: "https://www.youtube.com/embed/Sklc_fQBmcs", body: "Next.js is a React framework that enables several extra features, including server-side rendering and generating static websites." },
            { id: "app-router-overview", type: "text", title: "App Router Overview", body: "The App Router provide a more intuitive way to define routes and layouts compared to the traditional Pages router." }
          ],
          quiz: [
            { question: "What is Next.js primarily known for?", options: ["CSS Framework", "React Framework", "Database Engine", "Testing Library"], correctAnswerIndex: 1 },
            { question: "Which feature allows generating static HTML at build time?", options: ["Server Components", "Static Site Generation (SSG)", "Client Side Rendering", "Dynamic Routing"], correctAnswerIndex: 1 },
            { question: "In the App Router, what is the default rendering type for a component?", options: ["Client Component", "Server Component", "Static Component", "Shared Component"], correctAnswerIndex: 1 },
            { question: "What is the primary file name for defining a route's UI in Next.js?", options: ["index.js", "page.js", "layout.js", "route.js"], correctAnswerIndex: 1 },
            { question: "How do you share a UI across multiple routes in Next.js?", options: ["Using a shared component", "Using a layout.js file", "Copy-pasting the header", "Using a middleware"], correctAnswerIndex: 1 }
          ]
        },
        {
          id: "advanced-patterns",
          title: "Advanced Patterns",
          content: [
            { id: "server-components-video", type: "video", videoId: "video_2", title: "React Server Components", videoUrl: "https://www.youtube.com/embed/rjXAbLAs4I", body: "React Server Components allow developers to build applications that span the server and client." },
            { id: "patterns-overview", type: "text", title: "Modern Architectural Patterns", body: "Understanding the difference between Client and Server components is crucial for optimizing bundle size and performance." }
          ],
          quiz: [
            { question: "Where do React Server Components primarily execute?", options: ["In the Browser", "On the Server", "In the CDN", "On the User's Phone"], correctAnswerIndex: 1 },
            { question: "Which directive must be used to enable interactivity (like onClick) in a component?", options: ["'use server'", "'use interactive'", "'use client'", "'enable js'"], correctAnswerIndex: 2 },
            { question: "What component is used to show a loading state while content is streaming?", options: ["<Loading />", "<Wait />", "<Suspense />", "<Fallback />"], correctAnswerIndex: 2 },
            { question: "How does Partial Prerendering (PPR) improve performance?", options: ["By removing all CSS", "By combining static and dynamic content in one page", "By forcing everything onto the client", "By ignoring data fetching"], correctAnswerIndex: 1 },
            { question: "What is the benefit of streaming in React?", options: ["It makes the file larger", "It allows sending chunks of the UI as they are ready", "It requires 100% of data before showing anything", "It only works for CSS"], correctAnswerIndex: 1 }
          ]
        }
      ]
    },
    {
      id: "node-mastery",
      title: "Node.js Mastery",
      description: "Deep dive into back-end engineering, high-concurrency, and scalable architectures.",
      chapters: [
        {
          id: "event-loop",
          title: "The Event Loop",
          content: [
            { id: "event-loop-video", type: "video", videoId: "video_3", title: "Visualizing the Event Loop", videoUrl: "https://www.youtube.com/embed/8aGhZQkoFbQ", body: "Understanding how Node.js handles asynchronous operations through its single-threaded event loop is fundamental." },
            { id: "event-loop-overview", type: "text", title: "Non-Blocking I/O Concepts", body: "Node.js achieves high concurrency by offloading I/O operations to the system kernel." }
          ],
          quiz: [
            { question: "Is the JavaScript execution in Node.js multi-threaded?", options: ["Yes", "No", "Only for I/O", "Depends on the OS"], correctAnswerIndex: 1 },
            { question: "Which phase of the event loop executes callbacks scheduled by setTimeout?", options: ["Poll", "Check", "Timers", "Close"], correctAnswerIndex: 2 },
            { question: "Which core library handles the event loop and asynchronous I/O in Node.js?", options: ["V8", "Libuv", "NPM", "Express"], correctAnswerIndex: 1 },
            { question: "When does the 'Check' phase occur in the event loop?", options: ["Right before Timers", "Immediately after the Poll phase", "At the very start", "Only when the server stops"], correctAnswerIndex: 1 },
            { question: "What happens if the Poll phase is empty but there are 'Check' callbacks?", options: ["The loop stops", "The loop proceeds to the Check phase", "The loop sleeps", "The loop crashes"], correctAnswerIndex: 1 }
          ]
        },
        {
          id: "buffer-streams",
          title: "Buffers and Streams",
          content: [
            { id: "streams-video", type: "video", videoId: "video_4", title: "Streams in Depth", videoUrl: "https://www.youtube.com/embed/gNLOX7S3Y8I", body: "Buffers are regions of memory that store binary data. Streams allow us to read/write data in chunks." }
          ],
          quiz: [
            { question: "What is the primary purpose of a 'Buffer' in Node.js?", options: ["To store large videos", "To handle binary data outside the V8 heap", "To speed up CSS processing", "To replace JSON"], correctAnswerIndex: 1 },
            { question: "Which method is used to connect a readable stream to a writable stream?", options: ["connect()", "link()", "pipe()", "flow()"], correctAnswerIndex: 2 },
            { question: "What is 'Backpressure' in the context of streams?", options: ["A hardware failure", "When a readable stream emits data faster than the writable stream can handle", "Low CPU usage", "Compressed zip files"], correctAnswerIndex: 1 },
            { question: "Which stream type allows both reading and writing (like a network socket)?", options: ["Readable", "Writable", "Duplex", "Abstract"], correctAnswerIndex: 2 },
            { question: "What is the benefit of using Streams over fs.readFile() for large files?", options: ["Streams are older", "Streams require zero memory", "Streams process data in chunks without loading the entire file into RAM", "Streams only work with text"], correctAnswerIndex: 2 }
          ]
        }
      ]
    },
    {
      id: "sql-analytics",
      title: "Fullstack Analytics with SQL",
      description: "Master relational data modeling and analytical queries for modern applications.",
      chapters: [
        {
          id: "complex-joins",
          title: "Advanced SQL Joins",
          content: [
            { id: "joins-video", type: "video", videoId: "video_5", title: "Deep Dive into Joins", videoUrl: "https://www.youtube.com/embed/9yeOJ0Z3pmw", body: "Learn how to combine data from multiple tables effectively." }
          ],
          quiz: [
            { question: "Which type of JOIN returns only the records that have matching values in both tables?", options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"], correctAnswerIndex: 2 },
            { question: "What does a LEFT JOIN return if there is no match in the right table?", options: ["Error", "Empty string", "NULL", "The left table's name"], correctAnswerIndex: 2 },
            { question: "A 'Self Join' is used to...", options: ["Join a table with itself", "Delete all duplicates", "Reset the database", "Create a new table"], correctAnswerIndex: 0 },
            { question: "Which operator is used to combine the results of two SELECT statements (removing duplicates)?", options: ["COMBINE", "UNION", "MERGE", "PLUS"], correctAnswerIndex: 1 },
            { question: "When using a Subquery, where must it usually be placed?", options: ["Inside the CSS", "Within parentheses ()", "At the end of the .js file", "It's not allowed in SQL"], correctAnswerIndex: 1 }
          ]
        },
        {
          id: "performance-sql",
          title: "Performance Optimization",
          content: [
            { id: "indexing-video", type: "video", videoId: "video_6", title: "The Power of Indexes", videoUrl: "https://www.youtube.com/embed/HubezKbFL7E", body: "Learn how indexing can drastically speed up your analytical queries." }
          ],
          quiz: [
            { question: "What is the primary benefit of creating an INDEX on a column?", options: ["Saves disk space", "Speeds up data retrieval (SELECTs)", "Makes the table smaller", "Encrypts the data"], correctAnswerIndex: 1 },
            { question: "Which SQL command is used to see the execution plan of a query?", options: ["PLAN", "SHOW", "EXPLAIN", "CHECK"], correctAnswerIndex: 2 },
            { question: "What happens if you index every single column in a table?", options: ["Retrieval becomes instant", "INSERT and UPDATE operations will slow down", "The database becomes free", "Nothing changes"], correctAnswerIndex: 1 },
            { question: "What is a 'Full Table Scan'?", options: ["A hardware check", "When SQL has to read every single row because no suitable index was found", "A backup process", "Searching for empty rows"], correctAnswerIndex: 1 },
            { question: "Which index type is default for most relational database primary keys?", options: ["Hash", "B-Tree", "Gin", "Gist"], correctAnswerIndex: 1 }
          ]
        }
      ]
    },
    {
      id: "tailwind-design",
      title: "Tailwind CSS Design",
      description: "Build beautiful, responsive user interfaces at scale with utility-first CSS.",
      chapters: [
        {
          id: "tailwind-basics",
          title: "Utility-First Design",
          content: [
            { id: "tailwind-video", type: "video", videoId: "video_7", title: "Why Tailwind?", videoUrl: "https://www.youtube.com/embed/mr15Xzb1Ook", body: "Introduction to the philosophy of utility-first CSS." }
          ],
          quiz: [
            { question: "What is the 'Utility-First' philosophy?", options: ["Building large components directly in CSS", "Building UI using low-level utility classes", "Avoiding CSS entirely", "Using inline styles exclusively"], correctAnswerIndex: 1 },
            { question: "How does Tailwind avoid having a massive final CSS file?", options: ["By using JS only", "By purging/removing unused classes during build", "By compressing the font", "It doesn't"], correctAnswerIndex: 1 },
            { question: "What prefix is used for mobile-first responsive design (e.g., tablet size)?", options: ["tablet:", "t:", "md:", "responsive:"], correctAnswerIndex: 2 },
            { question: "Where do you customize the spacing or colors in a Tailwind project?", options: ["In style.css", "In index.html", "In tailwind.config.js", "In the browser console"], correctAnswerIndex: 2 },
            { question: "Which class would you use to add a 1rem (16px) margin on all sides?", options: ["margin-all-4", "m-4", "p-4", "auto-m"], correctAnswerIndex: 1 }
          ]
        },
        {
          id: "tailwind-systems",
          title: "Creating Design Systems",
          content: [
            { id: "tailwind-config-video", type: "video", videoId: "video_8", title: "The Tailwind Config", videoUrl: "https://www.youtube.com/embed/0S9W_N8yNZA", body: "Deep dive into theme customization." }
          ],
          quiz: [
            { question: "How do you extend the theme in Tailwind without overwriting defaults?", options: ["Edit the node_modules", "Use the 'extend' key in tailwind.config.js", "Add a new CSS file", "You can't"], correctAnswerIndex: 1 },
            { question: "What is the benefit of the JIT (Just-In-Time) engine?", options: ["It makes the build slower", "It generates CSS as you type your classes", "It adds more default colors", "It prevents using variables"], correctAnswerIndex: 1 },
            { question: "Which class applies a soft shadow in Tailwind?", options: ["shadow-soft", "shadow-sm", "shadow-blur", "drop-shadow-none"], correctAnswerIndex: 1 },
            { question: "How do you apply a style only on hover?", options: ["@hover", "hover:", "on:hover", ":hover"], correctAnswerIndex: 1 },
            { question: "What does the 'w-full' class do?", options: ["Sets width to 100%", "Sets height to 100%", "Sets font size", "Centers the element"], correctAnswerIndex: 0 }
          ]
        }
      ]
    },
    {
      id: "docker-mastery",
      title: "Docker Containers",
      description: "Learn to containerize your applications for consistent deployment anywhere.",
      chapters: [
        {
          id: "docker-intro",
          title: "Container Fundamentals",
          content: [
            { id: "docker-video", type: "video", videoId: "video_9", title: "Docker 101", videoUrl: "https://www.youtube.com/embed/gAkwW2tuIqE", body: "Introduction to containerization." }
          ],
          quiz: [
            { question: "What is an 'Image' in Docker?", options: ["A JPEG file", "A read-only template for creating containers", "A running server", "A database backup"], correctAnswerIndex: 1 },
            { question: "What is the command to build an image from a Dockerfile?", options: ["docker create", "docker build", "docker run", "docker ship"], correctAnswerIndex: 1 },
            { question: "What does the 'L' in Layers refer to in Docker?", options: ["Large files", "The stackable read-only filesystem parts of an image", "The Level of security", "Linux"], correctAnswerIndex: 1 },
            { question: "Which command lists all running containers?", options: ["docker list", "docker ps", "docker images", "docker ls"], correctAnswerIndex: 1 },
            { question: "What is the main difference between a Container and an Image?", options: ["Images are larger", "Containers are running instances of Images", "Images are for Linux only", "There is no difference"], correctAnswerIndex: 1 }
          ]
        },
        {
          id: "docker-network",
          title: "Networking and Volumes",
          content: [
            { id: "docker-net-video", type: "video", videoId: "video_10", title: "Docker Volumes", videoUrl: "https://www.youtube.com/embed/pTFZFxd4hOI", body: "Managing data persistence in containers." }
          ],
          quiz: [
            { question: "What is a Docker 'Volume' primarily used for?", options: ["Adjusting audio", "Persistent data storage that survives container restarts", "Speeding up the internet", "Compressing images"], correctAnswerIndex: 1 },
            { question: "Which network type is the default for Docker containers on a single host?", options: ["Host", "None", "Bridge", "Overlay"], correctAnswerIndex: 2 },
            { question: "How do you expose a container's port to the host system?", options: ["-p 80:80", "-port 80", "--open", "-h 80"], correctAnswerIndex: 0 },
            { question: "What is 'Docker Compose'?", options: ["A text editor", "A tool for defining and running multi-container applications", "A musical software", "A Docker feature for CSS"], correctAnswerIndex: 1 },
            { question: "What happens to data inside a container when the container is deleted (without volumes)?", options: ["It's saved to the cloud", "It's lost permanently", "It moves to another container", "It's stored in /tmp"], correctAnswerIndex: 1 }
          ]
        }
      ]
    }
];
