export const SONGS = {
  chanson1: {
    title: "Le Duel des Notes (chanson thème)",
    url: "/chanson1.mp3",
    lyrics: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nSed do eiusmod tempor incididunt ut labore et dolore.\nUt enim ad minim veniam, quis nostrud exercitation.\nUllamco laboris nisi ut aliquip ex ea commodo.",
      "Duis aute irure dolor in reprehenderit in voluptate velit.\nEsse cillum dolore eu fugiat nulla pariatur.\nExcepteur sint occaecat cupidatat non proident.\nSunt in culpa qui officia deserunt mollit anim.",
      "Curabitur pretium tincidunt lacus, sed viverra mauris.\nPraesent dapibus, neque id cursus faucibus, tortor.\nDonec vitae sapien ut libero venenatis faucibus.\nNullam quis ante, etiam sit amet orci eget.",
    ],
  },
  chanson2: {
    title: "Le Jardin de printemps",
    url: "/chanson2.mp3",
    lyrics: [
      "Integer tincidunt, tortor nec rhoncus dictum, massa.\nVivamus elementum semper nisi, aenean vulputate eleifend.\nAenean leo ligula, porttitor eu, consequat vitae.\nEleifend ac, enim, aliquam lorem ante dapibus.",
      "Phasellus viverra nulla ut metus varius laoreet.\nQuisque rutrum, aenean imperdiet etiam ultricies nisi.\nVel augue curabitur ullamcorper ultricies nisi nam.\nEget dui etiam rhoncus maecenas tempus tellus.",
      "Donec sodales sagittis magna sed consequat leo.\nVestibulum ante ipsum primis in faucibus orci.\nNam quam nunc, blandit vel, luctus pulvinar.\nHendrerit id, lorem maecenas nec odio et.",
    ],
  },
};

export const getSongUrl = (choice) => SONGS[choice]?.url ?? null;

export const getSongTitle = (choice) => SONGS[choice]?.title ?? "Chanson inconnue";

export const getSongLyrics = (choice) => SONGS[choice]?.lyrics ?? [];