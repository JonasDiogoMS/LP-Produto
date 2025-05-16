// src/pages/Produto.js
import { useEffect, useState } from "react";
import axios from "axios";
import img1 from '../../assets/3-8.jpg';
import img2 from '../../assets/3-24.jpg';
import img3 from '../../assets/3-28.jpg';
import img4 from '../../assets/3-18.jpg';

const produtoMock = {
  titulo: "Camiseta Classic",
  preco: 40.90,
  imagens: [img1, img2, img3, img4],
  tamanhos: ["P", "M", "G", "GG"],
  cores: ["Preto", "Azul", "Amarelo", "Verde"]
};

const salvarEstadoLocal = (chave, valor) => {
  const data = {
    valor,
    expira: new Date().getTime() + 15 * 60 * 1000 // 15 minutos
  };
  localStorage.setItem(chave, JSON.stringify(data));
};

const carregarEstadoLocal = (chave) => {
  const data = JSON.parse(localStorage.getItem(chave));
  if (data && new Date().getTime() < data.expira) {
    return data.valor;
  }
  return null;
};

export default function Produto() {
  const [imagemPrincipal, setImagemPrincipal] = useState(produtoMock.imagens[0]);
  const [tamanho, setTamanho] = useState(carregarEstadoLocal("tamanho") || "");
  const [cor, setCor] = useState(carregarEstadoLocal("cor") || "");
  const [cep, setCep] = useState(carregarEstadoLocal("cep") || "");
  const [endereco, setEndereco] = useState(carregarEstadoLocal("endereco") || null);

  // Salva seleções
  useEffect(() => salvarEstadoLocal("tamanho", tamanho), [tamanho]);
  useEffect(() => salvarEstadoLocal("cor", cor), [cor]);

  const buscarCep = async () => {
    try {
      const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (!res.data.erro) {
        setEndereco(res.data);
        salvarEstadoLocal("cep", cep);
        salvarEstadoLocal("endereco", res.data);
      } else {
        setEndereco("CEP não encontrado");
      }
    } catch {
      setEndereco("Erro ao buscar CEP");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Imagens */}
      <div>
        <img src={imagemPrincipal} alt="Produto" className="w-full h-auto rounded-xl shadow" />
        <div className="flex gap-2 mt-4">
          {produtoMock.imagens.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Miniatura ${idx}`}
              className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${imagemPrincipal === img ? "border-blue-500" : "border-transparent"}`}
              onClick={() => setImagemPrincipal(img)}
            />
          ))}
        </div>
      </div>

      {/* Informações */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">{produtoMock.titulo}</h1>
        <p className="text-2xl text-blue-600 font-semibold">R$ {produtoMock.preco.toFixed(2).replace('.', ',')}</p>

        {/* Tamanhos */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Tamanho:</label>
          <div className="flex gap-2">
            {produtoMock.tamanhos.map((t) => (
              <button
                key={t}
                className={`px-4 py-2 rounded border ${t === tamanho ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                onClick={() => setTamanho(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Cores */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Cor:</label>
          <div className="flex gap-2">
            {produtoMock.cores.map((c) => (
              <button
                key={c}
                className={`px-4 py-2 rounded border ${c === cor ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                onClick={() => setCor(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* CEP */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Calcular entrega (CEP):</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              placeholder="Digite o CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
            <button
              onClick={buscarCep}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Verificar
            </button>
          </div>
          {endereco && (
            <p className="mt-2 text-sm text-gray-700">
              {typeof endereco === "string" ? endereco : `${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}`}
            </p>
          )}
        </div>

        <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
