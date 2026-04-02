"use client";

import { useEffect, useMemo, useState } from "react";
import DuelCard from "./DuelCard";
import { ToastContainer } from "react-toastify";
import { gsap } from "gsap";

const DUELS_PAR_PAGE = 6;

const getTotalLikes = (duel) => {
    return (duel.premierChanteur?.nbLikes ?? 0) + (duel.deuxiemeChanteur?.nbLikes ?? 0);
};

const getLatestCreatedAt = (duel) => {
    return Math.max(duel.premierChanteur?.createdAt ?? 0, duel.deuxiemeChanteur?.createdAt ?? 0);
};

const DuelsVoterClient = ({ duels, mesVotes }) => {
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [activePlaybackKey, setActivePlaybackKey] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const duelsTries = useMemo(() => {
        const copie = [...duels];

        copie.sort((a, b) => {
            const valeurA = sortBy === "popularite" ? getTotalLikes(a) : getLatestCreatedAt(a);
            const valeurB = sortBy === "popularite" ? getTotalLikes(b) : getLatestCreatedAt(b);

            if (sortOrder === "asc") {
                return valeurA - valeurB;
            }

            return valeurB - valeurA;
        });

        return copie;
    }, [duels, sortBy, sortOrder]);

    const totalPages = Math.max(1, Math.ceil(duelsTries.length / DUELS_PAR_PAGE));

    useEffect(() => {
        setCurrentPage(1);
    }, [sortBy, sortOrder, duels.length]);

    const duelsPagine = useMemo(() => {
        const start = (currentPage - 1) * DUELS_PAR_PAGE;
        const end = start + DUELS_PAR_PAGE;
        return duelsTries.slice(start, end);
    }, [duelsTries, currentPage]);

    const pagesVisibles = useMemo(() => {
        const debut = Math.max(1, currentPage - 2);
        const fin = Math.min(totalPages, currentPage + 2);
        const pages = [];
        for (let i = debut; i <= fin; i++) pages.push(i);
        return pages;
    }, [currentPage, totalPages]);

    useEffect(() => {
        const tl = gsap.timeline({});
        const gridVote = document.querySelector(".gridVote");

        tl.to( gridVote, {
            y: 100,
            opacity: 0,
            duration: 0.4,
            ease: "power2.out"
        });
        tl.to( gridVote, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
        });
    }, []);

    return (
        <>
            <div className="filtre">
                <details>
                    <summary className="btn">Trier</summary>
                    <div className="menuFiltre">
                        <div className="filtreGroup">
                            <label htmlFor="triPar">Trier par</label>
                            <select id="triPar" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="popularite">Popularite (likes)</option>
                                <option value="date">Date</option>
                            </select>
                        </div>
                        <div className="separateur"></div>
                        <div className="filtreGroup">
                            <label htmlFor="ordreTri">Ordre</label>
                            <select id="ordreTri" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="desc">Descendant</option>
                                <option value="asc">Ascendant</option>
                            </select>
                        </div>
                    </div>
                </details>
            </div>

            <div className="gridVote">
                {duelsPagine.map((duel) => (
                    <DuelCard
                        key={duel.id}
                        duel={duel}
                        monVoteInitial={mesVotes[duel.id] ?? null}
                        activePlaybackKey={activePlaybackKey}
                        setActivePlaybackKey={setActivePlaybackKey}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="paginationDuels">
                    <button
                        type="button"
                        className="paginationBtn"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        Precedent
                    </button>

                    {pagesVisibles.map((page) => (
                        <button
                            key={page}
                            type="button"
                            className={`paginationBtn ${currentPage === page ? "paginationBtnActif" : ""}`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        type="button"
                        className="paginationBtn"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Suivant
                    </button>
                </div>
            )}

            <ToastContainer
                position="bottom-right"
                autoClose={3500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
            />
        </>
    );
};

export default DuelsVoterClient;