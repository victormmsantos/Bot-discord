import {
  tratarDadosClasseProeficiencias,
  tratarDadosClassesEquipamentos,
} from "../tratamento-dados";
import {
  alterandoUrlApi,
  fazendoListaComItensCompostos,
  fazendoListaComItensEspecificos,
} from "../index";

describe("Teste tratarDadosClassesEquipamentos", () => {
  it("deve tratar os dados corretamente", () => {
    const dadosATratar = {
      starting_equipment: [
        { quantity: 2, equipment: { name: "Machado", index: "machado" } },
        { quantity: 1, equipment: { name: "Lanca", index: "Lanca" } },
      ],
    };
    const objetoTratadoEsperado = [
      {
        value: `Escolha ${2} item entre estes:`,
        name: "Machado",
      },
      { value: `Escolha ${1} item entre estes:`, name: "Lanca" },
    ];

    const objetoRecebido = tratarDadosClassesEquipamentos(dadosATratar);

    expect(objetoTratadoEsperado).toEqual(objetoRecebido);
  });
});

describe("Teste tratarDadosClasseProeficiencias", () => {
  it("deve tratar dados classe proeficiencia corretamente", () => {
    const dadosATratar = {
      proficiency_choices: [
        {
          choose: 1,
          type: "atribute",
          from: [
            { name: "Religion", index: "religion" },
            { name: "Religion", index: "religion" },
          ],
        },
        {
          choose: 1,
          type: "proficiencies",
          from: [
            { name: "Tinker's Tools", index: "tinker's Tools" },
            { name: "Painter's Supplies", index: "painter's Supplies" },
          ],
        },
      ],
    };
    const objetoEsperado = [
      {
        value: "Escolha 1 atribute entre estas:",
        name: " Religion, Religion,",
      },
      {
        value: "Escolha 1 proficiencies entre estas:",
        name: " Tinker's Tools, Painter's Supplies,",
      },
    ];

    const objetoRecebido = tratarDadosClasseProeficiencias(dadosATratar);

    expect(objetoEsperado).toEqual(objetoRecebido);
  });
});

describe("alterandoUrl", () => {
  it("deve alterar a url de acordo com o que o usuario mandar", () => {
    const mensagemDoUsuario = ["!dnd", "races", "elf"];
    const mensagemEsperada = "races/elf/";

    const mensagemRecebida = alterandoUrlApi(mensagemDoUsuario);

    expect(mensagemEsperada).toEqual(mensagemRecebida);
  });
});

describe("fazendoListaComItensCompostos", () => {
  it("deve retornar uma lista dependendo dos itens necessarios", () => {
    const TIPO_ITENS_COMPOSTOS = ["cursos", "dificuldades"];

    const objetoASerTratado = {
      nome: "victor",
      empresa: "cwi",
      cursos: [
        { name: "java" },
        { name: "react" },
        { name: "engenharia" },
        { name: "seguranca" },
      ],
      dificuldades: [
        { name: "nao sei" },
        { name: "nao sei2" },
        { name: "nao sei3" },
      ],
    };

    const objetoEsperado = [
      { name: "cursos", value: " java, react, engenharia, seguranca," },
      { name: "dificuldades", value: " nao sei, nao sei2, nao sei3," },
    ];

    const objetoRecebido = fazendoListaComItensCompostos(
      objetoASerTratado,
      TIPO_ITENS_COMPOSTOS
    );

    expect(objetoEsperado).toEqual(objetoRecebido);
  });
});

describe("fazendoListaComItensEspecificos", () => {
  it("deve retornar uma lista dependendo dos itens necessarios", () => {
    const TIPO_ITENS_COMPOSTOS = ["nome", "empresa"];

    const objetoASerTratado = {
      nome: "victor",
      empresa: "cwi",
      cursos: [
        { name: "java" },
        { name: "react" },
        { name: "engenharia" },
        { name: "seguranca" },
      ],
      dificuldades: [
        { name: "nao sei" },
        { name: "nao sei2" },
        { name: "nao sei3" },
      ],
    };

    const objetoEsperado = [
      { name: "nome", value: "victor" },
      { name: "empresa", value: "cwi" },
    ];

    const objetoRecebido = fazendoListaComItensEspecificos(
      objetoASerTratado,
      TIPO_ITENS_COMPOSTOS
    );

    expect(objetoEsperado).toEqual(objetoRecebido);
  });
});
