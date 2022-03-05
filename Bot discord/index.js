const { Client, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");

import axios from "axios";
import {
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
} from "./infos-listas";
import { alteracaoDadosApiParaClasses } from "./tratamento-dados";

const client = new Client();
const DOG_API_URL = "https://dog.ceo/api/breeds/image/random";
const DND_API_URL = "https://www.dnd5eapi.co/api/";
const COLOR_EMBED = "#0099ff";
const INFOS_COM_ABILITY_BONUSES = ["races", "subraces"];
const COMANDOS = ["!dog", "!play", "!kick", "!dnd", "!rojao", "!roleta"];
const EXEMPLOS_COMANDOS = [
  "!dog: mostrara uma imagem de um cachorro aleatório",
  "!play LINK-DA-MUSICA: tocara a musica do link",
  "!kick @MEMBRO-A-KIKAR: Irá kikar o membro mencinado",
  "!dnd O QUE DESEJA PROCURAR. EX: !dnd classes ou !dnd races elf",
  "!rojao Solta um Rojão no Chat de voz que você esta!",
  "!roleta @MEMBRO @MEMBRO. Mencione os membros que você quer que participem da roleta",
];

async function getApi(apiAdress) {
  const { data } = await axios.get(apiAdress);
  return data;
}

client.on("ready", () => {
  client.user.setActivity("Dungeons & Dragons", { type: "PLAYING" });
  console.log(`Logged in as ${client.user.tag}!`);
});

async function playVideo(message) {
  let musicToPlay = message.content.split(" ")[1];
  if (message.member.voice.channel) {
    const connection = await message.member.voice.channel.join();
    if (message.content.split(" ")[1] === "rojao") {
      musicToPlay =
        "https://www.youtube.com/watch?v=Fi9x8C5i7Oc&ab_channel=GustaBeats";
    }
    console.log(musicToPlay);
    connection.play(
      ytdl(musicToPlay, {
        filter: "audioonly",
      })
    );
  } else {
    message.reply("Deve estar em um chat de voz para botar um som");
  }
}

function kikarMembro(message) {
  const user = message.mentions.users.first();
  if (user) {
    const member = message.guild.member(user);
    if (member) {
      if (!(member.voice.channelID === null)) {
        if (member.voice.id !== member.voice.guild.ownerID) {
          member.voice
            .kick()
            .then(() => {
              message.reply("A kikada foi um sucesso!");
            })
            .catch((err) => {
              message.reply("Não tenho permissão para fazer isto!");
            });
        } else {
          message.reply("Não da pra kikar o dono do grupo n po");
        }
      } else {
        message.reply("O alvo da kikada nao esta em um chat de voz");
      }
    }
  } else {
    message.reply("Você não mencionou o membro para kikar");
  }
}

function kikarAleatorio(message) {
  const arrayDeManos = Array.from(message.mentions.users);
  const random = randomIntFromInterval(0, arrayDeManos.length - 1);
  const member = message.guild.member(arrayDeManos[random][0]);
  const novoMembro = message.guild.member(member);
  if (!(novoMembro.voice.channelID === null)) {
    novoMembro.voice
      .kick()
      .then(() => {
        message.channel.send(
          `${novoMembro.user.username} foi sorteado pela roleta`
        );
      })
      .catch((err) => {
        message.reply("Não tenho permissão para fazer isto!");
      });
  } else {
    message.channel.send(
      `${novoMembro.user.username} não está em um canal de voz`
    );
  }
}

async function verificaSpan(message) {
  const historicoMensagens = await message.channel.messages.fetch({
    limit: 15,
  });
  const ultimasMensagensFiltradas = historicoMensagens
    .array()
    .filter((mensagem) => {
      return (
        mensagem.content[0] === "!" &&
        mensagem.author === message.author &&
        message.createdTimestamp <= mensagem.createdTimestamp + 5000
      );
    });
  if (ultimasMensagensFiltradas.length >= 3) {
    await message.channel.send("CALMA AE, SOU GRANDE MAS NÃO SOU DOIS");
    return true;
  }
  return false;
}

async function dormirBot(message) {
  client.destroy();
  await setTimeout(async () => {
    await client.login(
      "OTQ2OTYyMTU0OTI4NjAzMjA2.YhmVOw.J9zkAg1LApBC_C2ppOsjriIOoNM"
    );
    message.channel.send("VOLTEI!! VAI COM CALMA AGORA");
  }, 10000);
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

client.on("message", async (message) => {
  try {
    const spam = await verificaSpan(message);
    const messageEmMinusculo = message;
    messageEmMinusculo.content = messageEmMinusculo.content.toLowerCase();
    if (!spam) {
      if (messageEmMinusculo.content[0] === "!") {
        switch (messageEmMinusculo.content.split(" ")[0]) {
          case "!dog":
            dogApi(messageEmMinusculo);
            break;
          case "!play":
            playVideo(messageEmMinusculo);
            break;
          case "!kick":
            kikarMembro(messageEmMinusculo);
            break;
          case "!dnd":
            dndApi(messageEmMinusculo);
            break;
          case "!rojao":
            soltarRojao(messageEmMinusculo);
            break;
          case "!help":
            mostrarComandos(messageEmMinusculo);
            break;
          case "!roleta":
            kikarAleatorio(messageEmMinusculo);
            break;
          default:
            messageEmMinusculo.channel.send(
              "Opção inválida, caso queira saber mais sobre comandos digite: !help"
            );
        }
      }
    } else {
      await dormirBot(messageEmMinusculo);
    }
  } catch (err) {}
});

function mostrarComandos(message) {
  try {
    const embedComandos = EXEMPLOS_COMANDOS.map((item, index) => {
      return {
        value: item,
        name: COMANDOS[index],
        inline: false,
      };
    });

    const embed = new MessageEmbed()
      .setColor(COLOR_EMBED)
      .setTitle("COMANDOS")
      .addFields(embedComandos);

    message.channel.send(embed);
  } catch (err) {
    console.log(err);
  }
}

async function soltarRojao(message) {
  if (message.member.voice.channel) {
    const connection = await message.member.voice.channel.join();
    const musicToPlay =
      "https://www.youtube.com/watch?v=Fi9x8C5i7Oc&ab_channel=GustaBeats";
    connection.play(
      ytdl(musicToPlay, {
        filter: "audioonly",
      })
    );
  } else {
    message.reply("Deve estar em um chat de voz para botar um som");
  }
}

async function dogApi(message) {
  const dog = await getApi(DOG_API_URL);
  message.channel.send("DOGUINHO :3");
  message.channel.send(dog.message);
}

async function dndApi(message) {
  try {
    const messageToApi = message.content.split(" ");
    const enderecoApi = `${DND_API_URL}${alterandoUrlApi(messageToApi)}`;
    const dataApi = await getApi(enderecoApi);
    const finalMessage = verificacoesBotDnD(dataApi, message, messageToApi);
    finalMessage === undefined
      ? message.channel.send("Opção inválida!")
      : message.channel.send(finalMessage);
  } catch (err) {
    message.channel.send("Opção inválida!");
    console.log(err);
  }
}

function verificacoesBotDnD(respostaApi, message, mensagemSeparada) {
  const tamanhoMensage = mensagemSeparada.length;
  const primeiraMensagemSeparada = mensagemSeparada[1];
  let mensagemDeRetorno;
  if (primeiraMensagemSeparada === "races") {
    if (mensagemSeparada.length > 2) {
      return (mensagemDeRetorno = fazendoEmbedRacaEspecifica(
        respostaApi,
        INFOS_NORMAIS_ADICIONAIS_RACA,
        INFOS_COMPOSTAS_RACA,
        mensagemSeparada
      ));
    }
    mensagemDeRetorno = fazendoEmbedLista(
      `List of ${primeiraMensagemSeparada}`,
      primeiraMensagemSeparada,
      respostaApi.results
    );
  }

  if (primeiraMensagemSeparada === "spells") {
    if (tamanhoMensage > 2) {
      message.channel.send(`${"DESCRIÇÃO DA MAGIA:"} \n ${respostaApi.desc}`);
      return (mensagemDeRetorno = fazendoEmbedRacaEspecifica(
        respostaApi,
        INFOS_MAGIAS,
        INFOS_MAGIAS_COMPLEXAS,
        mensagemSeparada
      ));
    }
    mensagemDeRetorno =
      "Tente algo como: !dnd spells NOME-DA-MAGIA (em inglês)";
  }

  if (primeiraMensagemSeparada === "subraces") {
    if (tamanhoMensage > 2) {
      return fazendoEmbedRacaEspecifica(
        respostaApi,
        INFOS_NORMAIS_SUBRACAS,
        INFOS_COMPOSTAS_SUBRACAS,
        mensagemSeparada
      );
    }
    mensagemDeRetorno = fazendoEmbedLista(
      `List of ${primeiraMensagemSeparada}`,
      primeiraMensagemSeparada,
      respostaApi.results
    );
  }
  if (primeiraMensagemSeparada === "classes") {
    if (tamanhoMensage > 2) {
      if (tamanhoMensage > 3 && mensagemSeparada[3] === "spells") {
        message.channel.send(
          "Bote !dnd spells NOME-DA-MAGIA para procurar uma magia especifica"
        );
        if (respostaApi.count > 22) {
          const apiFiltrada = respostaApi.results.filter(
            (item, index) => index >= 22
          );

          message.channel.send(
            fazendoEmbedLista(
              `${mensagemSeparada[2]} spell list`,
              mensagemSeparada[3],
              apiFiltrada
            )
          );
        }
        return fazendoEmbedLista(
          `${mensagemSeparada[2]} spell list`,
          mensagemSeparada[3],
          respostaApi.results
        );
      }
      const apiTratada = alteracaoDadosApiParaClasses(respostaApi);
      return fazendoEmbedRacaEspecifica(
        apiTratada,
        INFOS_CLASSES_NORMAIS,
        INFOS_CLASSES_COMPLEXAS,
        mensagemSeparada
      );
    }
    mensagemDeRetorno = fazendoEmbedLista(
      `List of ${primeiraMensagemSeparada}`,
      primeiraMensagemSeparada,
      respostaApi.results
    );
  }
  if (primeiraMensagemSeparada === "languages") {
    if (tamanhoMensage > 2) {
      return fazendoEmbedRacaEspecifica(
        respostaApi,
        INFOS_LANGUAGES_BASICA,
        INFOS_LANGUAGES_COMPLEXAS,
        mensagemSeparada
      );
    }
    mensagemDeRetorno = fazendoEmbedLista(
      `List of ${primeiraMensagemSeparada}`,
      primeiraMensagemSeparada,
      respostaApi.results
    );
  }
  if (primeiraMensagemSeparada === "traits") {
    if (tamanhoMensage > 2) {
      return fazendoEmbedRacaEspecifica(
        respostaApi,
        INFOS_TRAITS_BASICA,
        INFOS_TRAITS_COMPLEXAS,
        mensagemSeparada
      );
    }
    const apiFiltrada = respostaApi.results.filter((_, index) => index > 25);
    message.channel.send(
      fazendoEmbedLista(
        `List of ${mensagemSeparada[1]} `,
        mensagemSeparada[1],
        apiFiltrada
      )
    );
    mensagemDeRetorno = fazendoEmbedLista(
      `List of ${primeiraMensagemSeparada}`,
      primeiraMensagemSeparada,
      respostaApi.results
    );
  }
  return mensagemDeRetorno;
}

function fazendoEmbedRacaEspecifica(
  respostaApi,
  tipoListaBasica,
  listaEspecifica,
  message
) {
  let novasInformacoes = { name: "________", value: "________" };
  if (INFOS_COM_ABILITY_BONUSES.includes(message[1]) && message.length > 2) {
    novasInformacoes = respostaApi.ability_bonuses.map((item) => {
      return {
        name: item.ability_score.name,
        value: item.bonus,
        inline: true,
      };
    });
  }
  const informacoesFixas = fazendoListaComItensEspecificos(
    respostaApi,
    tipoListaBasica
  );
  const listaComplexa = fazendoListaComItensCompostos(
    respostaApi,
    listaEspecifica
  );
  const embed = new MessageEmbed()
    .setColor(COLOR_EMBED)
    .setTitle(respostaApi.name)
    .addFields(novasInformacoes)
    .addFields(informacoesFixas)
    .addFields(listaComplexa);
  return embed;
}

export function fazendoListaComItensEspecificos(respostaApi, listaTipo) {
  return listaTipo.map((item) => {
    return {
      name: item,
      value: respostaApi[item],
    };
  });
}

export function fazendoListaComItensCompostos(respostaApi, listaTipo) {
  return listaTipo.map((item) => {
    if (respostaApi[item].length === 0) {
      return {
        name: item,
        value: "Nenhum",
      };
    }
    return {
      name: item,
      value: respostaApi[item].reduce((acumulador, atual) => {
        return `${acumulador} ${atual.name},`;
      }, ""),
    };
  });
}

function fazendoEmbedLista(tittle, descricao, informacoesAdicionais) {
  const novasInformacoes = informacoesAdicionais.map((item) => {
    return {
      name: item.name,
      value: item.index,
      inline: true,
    };
  });
  const embed = new MessageEmbed()
    .setColor(COLOR_EMBED)
    .setTitle(tittle)
    .setDescription(descricao)
    .addFields(novasInformacoes);
  return embed;
}

export function alterandoUrlApi(array) {
  return array.reduce((acumulador, itemAtual, index) => {
    if (index === 0) {
      return acumulador;
    } else {
      return `${acumulador}${itemAtual}${"/"}`;
    }
  }, "");
}

client.login("OTQ2OTYyMTU0OTI4NjAzMjA2.YhmVOw.J9zkAg1LApBC_C2ppOsjriIOoNM");
