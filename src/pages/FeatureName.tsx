import { useEffect, useState } from "react";
import styled from "styled-components";
import { getCharacteristicById } from "../services/api";
import { Characteristic } from "../types";

const Badge = styled.span`
    background: #e6fffa;
    color: #319795;
    padding: 6px 12px;
    border-radius: 12px;
    border: 1px solid #319795;
`;

const FeatureNameContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

interface FeatureNameProps {
    charId: string;
}

export default function FeatureName({ charId }: FeatureNameProps) {
    const [characteristics, setCharacteristics] = useState<Characteristic>();

    useEffect(() => {
        if (charId) {
            getCharacteristics(charId);
        }
    }, [charId]);


    const getCharacteristics = async (charId: string) => {
        const res = await getCharacteristicById(charId);
        console.log(res.data);
        setCharacteristics(res.data);
    }

    return (
        <FeatureNameContainer>
            {
                characteristics?.fields?.nome_caracteristica != undefined ?
                    <Badge>{characteristics?.fields?.nome_caracteristica}</Badge>
                    :
                    <Badge>Sem característica</Badge>
            }
        </FeatureNameContainer>
    );
}

