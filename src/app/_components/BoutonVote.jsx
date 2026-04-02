"use client";
import { useState, useTransition } from "react";
import { voterAction } from "@/app/_actions/recording";

const BoutonVote = ({ enregistrementId, duelId, nbLikes, monVote }) => {
    const [likes, setLikes] = useState(nbLikes);
    const [voteActuel, setVoteActuel] = useState(monVote);
    const [isPending, startTransition] = useTransition();

    const dejaVotePourCelui = voteActuel === enregistrementId;
    const dejaVotePourAutre = voteActuel !== null && voteActuel !== undefined && voteActuel !== enregistrementId;

    const handleVote = () => {
        if (dejaVotePourCelui || isPending) return;

        startTransition(async () => {
            const res = await voterAction(enregistrementId, duelId);
            if (res.success) {
                if (res.changed) {
                    // transferred vote from the other one
                    setLikes((prev) => prev + 1);
                } else {
                    setLikes((prev) => prev + 1);
                }
                setVoteActuel(enregistrementId);
            }
        });
    };

    return (
        <button
            className={`boutonVote ${dejaVotePourCelui ? "vote-actif" : ""} ${dejaVotePourAutre ? "vote-desactive" : ""}`}
            onClick={handleVote}
            disabled={isPending}
            aria-label="Voter"
        >
            <img className="coeur" src="/Images/svg/coeur.svg" alt="Icon Coeur" />
            <p>{likes}</p>
        </button>
    );
};

export default BoutonVote;
