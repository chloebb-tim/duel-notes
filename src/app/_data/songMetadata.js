export const SONGS = {
  chanson1: {
    title: "Le Duel des Notes (chanson thème)",
    url: "/chanson1.mp3",
    lyrics: [
      "C’est le Duel des Notes, exprime toute ta passion\nLa même musique pour deux, mais chacun sa version\nC’est une arène féroce, ici la voix fait loi\nPour avoir la victoire, deux options s’offrent à toi",
      "Trouve un duel qui t’inspire, fais-le à ta façon\nAvec les mêmes paroles, posées sur le même son\nTu peux aussi lancer ton propre défi vocal\nDonne le meilleur de toi et attends ton rival",
      "Quand tu as terminé, n’oublie pas de voter\nLes duels les plus aimés sont toujours affichés\nPour chaque duel écouté, choisis la meilleure voix\nÇa peut être difficile, car tu n’as qu’un seul choix",
    ],
  },
  chanson2: {
    title: "Le Printemps",
    url: "/chanson2.mp3",
    lyrics: [
      "Le printemps est enfin arrivé\nLes fleurs ont hâte de pousser\nOn sent le soleil de l’été naissant\nAinsi que le vent de l’hiver mourant",
      "Bientôt les bourgeons vont ouvrir,\nSur chaque visage, on verra un sourire\nL’herbe poussera et tout sera vert,\nSoyons heureux de la fin de l’hiver",
      "La neige disparait sous nos pieds\nOn change nos bottes pour des souliers\nLa lumière au bout du tunnel\nLa vie est de plus en plus belle",
    ],
  },
};

export const getSongUrl = (choice) => SONGS[choice]?.url ?? null;

export const getSongTitle = (choice) => SONGS[choice]?.title ?? "Chanson inconnue";

export const getSongLyrics = (choice) => SONGS[choice]?.lyrics ?? [];