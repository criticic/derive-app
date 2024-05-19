import { Paper } from "./Home";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// PaperDetailed extends Paper
type PaperDetailed = Paper & {
    externalIds: {
        ArXiv: string;
        DOI: string;
        DBLP: string;
    };
    journal: string;
    isOpenAccess: boolean;
    openAccessPdf: string | null;
    actualAbstract: string;
};


const PaperInfo = () => {
    const { id } = useParams<{ id: string }>();
    const [paper, setPaper] = useState<PaperDetailed | null>(null);

    useEffect(() => {
        const fetchPaper = async () => {
            try {
                const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/${id}?fields=title,citationCount,tldr,year,fieldsOfStudy,authors,externalIds,journal,abstract,isOpenAccess,openAccessPdf`);
                const data = await response.json();
                console.log('Data from Semantic Scholar:', data);
                var output: PaperDetailed = {
                    id: data.paperId,
                    title: data.title,
                    year: data.year,
                    citationCount: data.citationCount,
                    abstract: data.tldr.text,
                    field: data.fieldsOfStudy[0],
                    authors: data.authors.map((author: any) => author.name).join(', '),
                    externalIds: data.externalIds,
                    journal: data.journal.name,
                    isOpenAccess: data.isOpenAccess,
                    openAccessPdf: data.isOpenAccess ? data.openAccessPdf.url : null,
                    actualAbstract: data.abstract
                };
                setPaper(output);
            } catch (error) {
                console.error('Error fetching data from Semantic Scholar:', error);
            }
        };

        fetchPaper();
    }, [id]);

    return (
        <div className="parent h-full bg-stone-50 flex flex-row overflow-hidden">
            <div className="content flex-auto h-full p-3 overflow-auto">
                {paper && (
                    <div className="relative bg-stone-100 p-3 rounded-lg outline outline-1 outline-stone-200">
                        <div className="flex items-center mb-2 text-sm">
                            <div className="text-gray-500 bg-white px-1 rounded-lg">{paper.year}</div>
                            <div className="text-gray-500 ml-2 ">{paper.field}</div>
                            {paper.externalIds.DOI && <div className="text-gray-500 ml-2 text-sm outline outline-1 px-1 rounded-lg">DOI:{paper.externalIds.DOI}</div>}
                            {paper.externalIds.ArXiv && <div className="text-gray-500 ml-2 text-sm outline outline-1 px-1 rounded-lg">ArXiv:{paper.externalIds.ArXiv}</div>}
                            {paper.isOpenAccess && <div className="text-green-500 ml-2 text-sm outline outline-1 px-1 rounded-lg">Open Access</div>}
                        </div>
                        <h1 className="text-2xl font-semibold mb-2">{paper.title}</h1>
                        <div className="text-gray-700 mb-2">AUTHORS: {paper.authors}</div>
                        {/* <div className="text-gray-700 mb-2 text-sm">published in: {paper.journal}</div> */}
                        {paper.journal !== undefined && <div className="text-gray-700 mb-2 text-sm">published in: {paper.journal}</div>}
                        <div className="text-gray-600 mb-2 italic">tldr: {paper.abstract}</div>
                        <div className="text-gray-600 mb-2 text-sm">Abstract: {paper.actualAbstract}</div>
                        {paper.openAccessPdf
                            ? <a href={paper.openAccessPdf} target="_blank" rel="noreferrer" className="text-blue-500 mb-2">Read the full paper</a>
                            : <a href={`https://annas-archive.org/scidb/${paper.externalIds.DOI}`} target="_blank" rel="noreferrer" className="text-blue-500 mb-2">Not Open Access? Who cares? Try searching the paper on Anna's Archive</a>}
                        <div className="mb-10"/>
                        <div className="flex justify-between mb-2 items-center absolute bottom-0">
                            <div className="text-gray-500">{paper.citationCount} citations</div>
                            <div className="text-gray-500">{paper.citationCount} citations</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PaperInfo;