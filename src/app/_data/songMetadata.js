const chanson1Lyrics = [
  "C'est le Duel des Notes, exprime toute ta passion\nLa m\u00eame musique pour deux, mais chacun sa version\nC'est une ar\u00e8ne f\u00e9roce, ici la voix fait loi\nPour avoir la victoire, deux options s'offrent \u00e0 toi",
  "Trouve un duel qui t'inspire, fais-le \u00e0 ta fa\u00e7on\nAvec les m\u00eames paroles, pos\u00e9es sur le m\u00eame son\nTu peux aussi lancer ton propre d\u00e9fi vocal\nDonne le meilleur de toi et attends ton rival",
  "Quand tu as termin\u00e9, n'oublie pas de voter\nLes duels les plus aim\u00e9s sont toujours affich\u00e9s\nPour chaque duel \u00e9cout\u00e9, choisis la meilleure voix\n\u00c7a peut \u00eatre difficile, car tu n'as qu'un seul choix",
];

const chanson2Lyrics = [
  "Le printemps est enfin arriv\u00e9\nLes fleurs ont h\u00e2te de pousser\nOn sent le soleil de l'\u00e9t\u00e9 naissant\nAinsi que le vent de l'hiver mourant",
  "Bient\u00f4t les bourgeons vont ouvrir,\nSur chaque visage, on verra un sourire\nL'herbe poussera et tout sera vert,\nSoyons heureux de la fin de l'hiver",
  "La neige disparait sous nos pieds\nOn change nos bottes pour des souliers\nLa lumi\u00e8re au bout du tunnel\nLa vie est de plus en plus belle",
];

export const SONGS = {
  // R\u00e9trocompatibilit\u00e9 avec les anciens enregistrements en BD
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

  chanson1_v1: {
    title: "Le Duel des Notes (chanson th\u00e8me)",
    url: "/chanson1_version1.mp3",
    lyrics: chanson1Lyrics,
    group: "chanson1",
    version: 1,
  },
  chanson1_v2: {
    title: "Le Duel des Notes (chanson th\u00e8me)",
    url: "/chanson1_version2.mp3",
    lyrics: chanson1Lyrics,
    group: "chanson1",
    version: 2,
  },
  chanson1_v3: {
    title: "Le Duel des Notes (chanson th\u00e8me)",
    url: "/chanson1_version3.mp3",
    lyrics: chanson1Lyrics,
    group: "chanson1",
    version: 3,
  },

  chanson2_v1: {
    title: "Le Printemps",
    url: "/chanson2_version1.mp3",
    lyrics: chanson2Lyrics,
    group: "chanson2",
    version: 1,
  },
  chanson2_v2: {
    title: "Le Printemps",
    url: "/chanson2_version2.mp3",
    lyrics: chanson2Lyrics,
    group: "chanson2",
    version: 2,
  },
  chanson2_v3: {
    title: "Le Printemps",
    url: "/chanson2_version3.mp3",
    lyrics: chanson2Lyrics,
    group: "chanson2",
    version: 3,
  },
};

export const SONG_GROUPS = [
  {
    key: "chanson1",
    title: "Le Duel des Notes (chanson th\u00e8me)",
    versions: ["chanson1_v1", "chanson1_v2", "chanson1_v3"],
  },
  {
    key: "chanson2",
    title: "Le Printemps",
    versions: ["chanson2_v1", "chanson2_v2", "chanson2_v3"],
  },
];

export const getSongUrl = (choice) => SONGS[choice]?.url ?? null;

export const getSongTitle = (choice) => SONGS[choice]?.title ?? "Chanson inconnue";

export const getSongLyrics = (choice) => SONGS[choice]?.lyrics ?? [];