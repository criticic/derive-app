import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Paper } from './Home';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([] as Paper[]);

    const fetchData = async () => {
        const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${query}&fields=paperId,title,tldr,authors,year,fieldsOfStudy,citationCount`);
        const data = await response.json();
        console.log('Data from Semantic Scholar:', data);
        const output = data.data.map((result: any) => ({
            paperId: result.paperId,
            title: result.title,
            abstract: result.tldr?.text,
            authors: result.authors[0].name + ' et al.',
            year: result.year,
            field: result.field,
            citationCount: result.citationCount
        }));

        setResults(output);
    };

    return (
        <div className="parent bg-stone-50 h-full flex flex-row overflow-hidden">
            <div className="content flex-auto h-full p-3 overflow-auto">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for papers..."
                    className="p-2 border border-gray-300 w-3/4 rounded"
                />
                <button onClick={fetchData} className="ml-2 p-2 bg-blue-500 text-white rounded">Search</button>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((paper, index) => (
                        <div key={index} className="relative bg-stone-100 p-3 rounded-lg outline outline-1 outline-stone-200">
                            <div className="flex items-center mb-2 text-sm">
                                <div className="text-gray-500 bg-white px-1 rounded-lg">{paper.year}</div>
                                <div className="text-gray-500 ml-2">{paper.field}</div>
                                <button
                                    onClick={() => {}}
                                    className="ml-auto text-red-500"> Add </button>
                            </div>
                            <Link to={`/paper/${paper.id}`} className="text-lg font-semibold mb-2 hover:underline hover:italic">{paper.title}</Link>
                            <div className="text-gray-700 mb-2">{paper.authors}</div>
                            <div className="text-gray-600 mb-10">{paper.abstract}</div>
                            <div className="flex justify-between mb-2 items-center absolute bottom-0">
                                <div className="text-gray-500">{paper.citationCount} citations</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Search;