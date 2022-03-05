export {
  INFOS_COMPOSTAS_RACA,
  INFOS_MAGIAS,
  INFOS_NORMAIS_ADICIONAIS_RACA,
  INFOS_MAGIAS_COMPLEXAS,
  INFOS_NORMAIS_SUBRACAS,
  INFOS_COMPOSTAS_SUBRACAS,
  INFOS_CLASSES_NORMAIS,
  INFOS_CLASSES_COMPLEXAS,
  INFOS_LANGUAGES_BASICA,
  INFOS_LANGUAGES_COMPLEXAS,
  INFOS_TRAITS_BASICA,
  INFOS_TRAITS_COMPLEXAS,
};

const INFOS_NORMAIS_ADICIONAIS_RACA = [
  "age",
  "alignment",
  "size",
  "size_description",
  "speed",
];

const INFOS_COMPOSTAS_RACA = [
  "traits",
  "languages",
  "subraces",
  "starting_proficiencies",
];

const INFOS_MAGIAS = [
  "name",
  "range",
  "ritual",
  "duration",
  "concentration",
  "casting_time",
  "level",
];

const INFOS_MAGIAS_COMPLEXAS = ["classes"];

const INFOS_NORMAIS_SUBRACAS = ["name", "desc"];

const INFOS_COMPOSTAS_SUBRACAS = [
  "starting_proficiencies",
  "languages",
  "racial_traits",
];

const INFOS_CLASSES_NORMAIS = [
  "name",
  "hit_die",
  "STARTING_WEAPON_OPTION",
  "CASTING_ATTIBUTE",
];

const INFOS_CLASSES_COMPLEXAS = [
  "proficiency_choices",
  "CHOOSE_AMONG_THESE_EQUIPMENT",
  "proficiencies",
  "saving_throws",
];

const INFOS_LANGUAGES_BASICA = ["name", "type", "script", "typical_speakers"];

const INFOS_LANGUAGES_COMPLEXAS = [];

const INFOS_TRAITS_BASICA = ["name", "desc"];

const INFOS_TRAITS_COMPLEXAS = ["races"];
