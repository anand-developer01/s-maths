import { createContext, useState } from 'react'

interface Kid {
    id: number;
    kidName: string;
    pin: number;
    alphabetScore: number;
    numbersScore: number;
    mathScore: number;
    puzzleScore: number;
    level: number;
}

interface ScoreBoardContextType {
    kidDetails: Kid[];
    kidData: Kid;

    updateScore: (kData: Partial<Kid>) => void

    kidRegister: (newKid: { name: string, pin: number }) => void
}
// if we have return type 
// checkPin: (pin: number) => boolean


const initialData: Kid = {
    id: 1,
    kidName: 'srihas',
    pin: 1234,
    alphabetScore: 0,
    numbersScore: 0,
    mathScore: 0,
    puzzleScore: 0,
    level: 0
}

export const ScoreBoardContext = createContext<ScoreBoardContextType>({
    kidDetails: [],
    kidData: initialData,

    updateScore: () => { },

    kidRegister: () => { },
});


const ScoreBoardProvider = ({ children }: any) => {
    const [kidData, setKidData] = useState<Kid>(initialData);
    const [kidDetails, setkidDetails] = useState<Kid[]>([]);

    const updateScore = (
        kData: Partial<Kid>
    ) => {
        setKidData(pre => ({ ...pre, ...kData }))
    }

    const kidRegister = (newKid: { name: string, pin: number }) => {
        const { name, pin } = newKid;
        const kidData = {
            id: 1,
            kidName: name,
            pin: pin,
            alphabetScore: 0,
            numbersScore: 0,
            mathScore: 0,
            puzzleScore: 0,
            level: 0
        }
        setkidDetails(prev => [...prev, kidData])
    }

    return (
        <ScoreBoardContext.Provider value={{ kidDetails, kidData, updateScore, kidRegister }}>
            {children}
        </ScoreBoardContext.Provider>
    )
}

export default ScoreBoardProvider;