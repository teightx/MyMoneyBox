# MyMoneyBox - Aplicativo de Gestão Financeira Pessoal

MyMoneyBox é um aplicativo de gestão financeira pessoal completo, desenvolvido com React Native + Expo, que funciona 100% no frontend sem necessidade de backend. O aplicativo permite gerenciar suas finanças pessoais de forma simples e eficiente, com recursos avançados de visualização e análise de dados.

## Funcionalidades Principais

- **Dashboard Principal**
  - Gráficos interativos de fluxo de caixa
  - Resumo financeiro do mês
  - Botões rápidos para adicionar transações

- **Gerenciamento de Transações**
  - Cadastro de receitas e despesas
  - Categorização personalizada
  - Suporte para transações recorrentes
  - Anexo de imagens (recibos)

- **Relatórios e Análises**
  - Gráficos por categoria
  - Análise de tendências
  - Filtros avançados

- **Planejamento Financeiro**
  - Definição de metas
  - Alertas de contas a pagar
  - Monitoramento de limites por categoria

- **Segurança e Dados**
  - Armazenamento local seguro
  - Exportação/Importação de dados
  - Proteção por biometria

## Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- React Native Paper
- Victory Native (gráficos)
- AsyncStorage
- React Navigation

## Requisitos

- Node.js 14+
- Expo CLI
- Android Studio (para desenvolvimento Android)
- Xcode (para desenvolvimento iOS - apenas macOS)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/mymoneybox.git
cd mymoneybox
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o projeto:
```bash
npm start
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── screens/        # Telas do aplicativo
  ├── navigation/     # Configuração de navegação
  ├── context/        # Contextos do React
  ├── constants/      # Constantes e temas
  ├── utils/          # Funções utilitárias
  ├── hooks/          # Hooks personalizados
  ├── types/          # Definições de tipos TypeScript
  └── assets/         # Recursos estáticos
```

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

Seu Nome - [seu-email@exemplo.com](mailto:seu-email@exemplo.com)

## Agradecimentos

- Expo Team
- React Native Community
- React Navigation Team
- Victory Charts 