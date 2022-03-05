export function alteracaoDadosApiParaClasses(dados) {
  const {
    proficiency_choices,
    starting_equipment,
    starting_equipment_options,
    spellcasting,
    ...resto
  } = dados;
  console.log(dados);
  const novasProficiencias = tratarDadosClasseProeficiencias(dados);
  const novosEquipamento = tratarDadosClassesEquipamentos(dados);
  const novasArmas = starting_equipment_options[0].from[0].equipment?.name;
  const novaSpellCasting = spellcasting?.spellcasting_ability?.name;

  let verificacaoArma;
  verificacaoArma =
    novasArmas === undefined
      ? (verificacaoArma = "none!")
      : (verificacaoArma = novasArmas);

  let verificacaoSpellCasting;
  verificacaoSpellCasting =
    novaSpellCasting === undefined
      ? (verificacaoSpellCasting = "none!")
      : (verificacaoSpellCasting = novaSpellCasting);

  return {
    proficiency_choices: novasProficiencias,
    CHOOSE_AMONG_THESE_EQUIPMENT: novosEquipamento,
    STARTING_WEAPON_OPTION: verificacaoArma,
    CASTING_ATTIBUTE: verificacaoSpellCasting,
    ...resto,
  };
}

export function tratarDadosClasseProeficiencias(dados) {
  const novasProficiency = dados.proficiency_choices.map((item) => {
    return {
      value: `Escolha ${item.choose} ${item.type} entre estas:`,
      name: item.from.reduce((acumulador, atual) => {
        return `${acumulador} ${atual.name},`;
      }, ""),
    };
  });
  return novasProficiency;
}

export function tratarDadosClassesEquipamentos(dados) {
  const novosEquipamentos = dados.starting_equipment.map((item) => {
    return {
      value: `Escolha ${item.quantity} item entre estes:`,
      name: item.equipment.name,
    };
  });

  return novosEquipamentos;
}
