import "./css/DuelsVoter.css";
import "./css/Bouton.css";

import { getDuelscomplets, getVotesDuUser } from "@/app/_data/data_recording";
import { getSession } from "@/lib/auth";
import DuelsVoterClient from "./DuelsVoterClient";

const DuelsVoter = async () => {
    const duels = await getDuelscomplets();
    const session = await getSession();
    const userId = session?.user?.id ?? null;
    const duelIds = duels.map(d => d.id);
    const mesVotes = await getVotesDuUser(userId, duelIds);

    return (
        <div className="PageVoter">
            <DuelsVoterClient duels={duels} mesVotes={mesVotes} />
        </div>
    );
};

export default DuelsVoter;