import { useState, useEffect } from 'react';
import { Store } from '@tauri-apps/plugin-store';


type Paper = {
    title: string;
    year: number;
    citationCount: number;
    abstract: string;
    field: string;
    authors: string;
};

const store = new Store('store.bin');

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [papers, setPapers] = useState([] as Paper[]);

    useEffect(() => {
        const loadPapers = async () => {
            const storedPapers = await store.get('papers');
            if (storedPapers) {
                setPapers(storedPapers as Paper[]);
            }
        };

        loadPapers();
    }, []);

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            try {
                const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/${searchQuery}?fields=title,citationCount,tldr,year,fieldsOfStudy,authors`);
                const data = await response.json();
                console.log('Data from Semantic Scholar:', data);
                var output = {
                    title: data.title,
                    year: data.year,
                    citationCount: data.citationCount,
                    abstract: data.tldr.text.substring(0, 200) + '...',
                    field: data.fieldsOfStudy[0],
                    authors: data.authors[0].name + " et al."
                };
                // update the state with the fetched data
                setPapers([...papers, output]);

                await store.set('papers', [...papers, output]);
            } catch (error) {
                console.error('Error fetching data from Semantic Scholar:', error);
            }
        }
    };

    return (
        <div className="parent bg-stone-50 flex flex-row overflow-hidden">
            <div className="sidebar flex-none pl-6 h-full">
                <div className="">
                    <h2 className="text-sm mb-2">Up next</h2>
                    <h2 className="text-sm mb-2">Bookmarked</h2>
                    <h2 className="text-sm mb-6">Trending</h2>
                    <h2 className="text-sm mb-2">My library</h2>
                </div>
                <div className="h-3/4 overflow-auto pr-10">
                    <ul>
                        {[
                            'AI', 'Computer Science', 'Bioinformatics', 'Genetics', 'Psychology',
                            'History', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geology',
                            'Astronomy', 'Linguistics', 'Anthropology', 'Sociology', 'Economics',
                            'Political Science', 'Philosophy', 'Theology', 'Literature', 'Art', 'Diplomacy'
                        ].map((category, index) => {
                            const colors = [
                                'bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-orange-500',
                                'bg-purple-500', 'bg-teal-500', 'bg-pink-500', 'bg-lime-500', 'bg-rose-500',
                                'bg-yellow-600', 'bg-indigo-500', 'bg-blue-300', 'bg-amber-500'
                            ];
                            return (
                                <li key={index} className="flex items-center mb-2 text-sm">
                                    <span className={`w-3 h-3 ${colors[index % colors.length]} rounded-full mr-2`}></span>
                                    {category}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            <div className="content flex-auto h-full p-3 overflow-auto">
                <div className="mb-4 w-full">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for papers..."
                        className="p-2 border border-gray-300 w-3/4 rounded"
                    />
                    <button
                        onClick={handleSearch}
                        className="ml-2 p-2 bg-blue-500 text-white rounded"
                    >
                        Search
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {papers.map((item, index) => (
                        <div key={index} className="relative bg-stone-100 p-3 rounded-lg outline outline-1 outline-stone-200">
                            <div className="flex items-center mb-2 text-sm">
                                <div className="text-gray-500 bg-white px-1 rounded-lg">{item.year}</div>
                                <div className="text-gray-500 ml-2">{item.field}</div>
                                <button
                                    onClick={() => {
                                        const newPapers = papers.filter((_, i) => i !== index);
                                        setPapers(newPapers);
                                        store.set('papers', newPapers);
                                    }}
                                    className="ml-auto text-red-500"> delete </button>
                            </div>
                            <div className="text-lg font-semibold mb-2">{item.title}</div>
                            <div className="text-gray-700 mb-2">{item.authors}</div>
                            <div className="text-gray-600 mb-10">{item.abstract}</div>
                            <div className="flex justify-between mb-2 items-center absolute bottom-0">
                                <div className="text-gray-500">{item.citationCount} citations</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
