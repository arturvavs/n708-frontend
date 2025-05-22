export const mockUsers = [
  {
    id: 1,
    name: 'Admin Teste',
    email: 'admin@example.com',
    document: '000.000.000-00',
    document_type: 'cpf',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Prefeitura Teste',
    email: 'prefeitura@example.com',
    document: '00.000.000/0000-00',
    document_type: 'cnpj',
    role: 'organization'
  },
  {
    id: 3,
    name: 'Usuário Comum',
    email: 'usuario@example.com',
    document: '123.456.789-00',
    document_type: 'cpf',
    role: 'user'
  }
];

// Tickets mockados
export const mockTickets = [
  {
    id: 1,
    title: 'Buraco na calçada',
    description: 'Existe um buraco grande na calçada que está causando acidentes com pedestres.',
    user_id: 3,
    image_url: null,
    address: 'Rua das Flores, 123 - Centro',
    status: 'aberto',
    created_at: '2025-05-15T10:30:00',
    updated_at: '2025-05-15T10:30:00'
  },
  {
    id: 2,
    title: 'Poste com lâmpada queimada',
    description: 'A lâmpada do poste da esquina está queimada há mais de uma semana, deixando a rua escura durante a noite.',
    user_id: 3,
    image_url: null,
    address: 'Avenida Principal, 500 - Jardim Europa',
    status: 'em andamento',
    created_at: '2025-05-14T15:45:00',
    updated_at: '2025-05-16T09:20:00'
  },
  {
    id: 3,
    title: 'Vazamento de água',
    description: 'Há um vazamento de água na rua que está causando desperdício e formando uma poça grande.',
    user_id: 3,
    image_url: null,
    address: 'Rua dos Ipês, 78 - Jardim Botânico',
    status: 'resolvido',
    created_at: '2025-05-10T08:15:00',
    updated_at: '2025-05-17T14:30:00'
  },
  {
    id: 4,
    title: 'Lixo acumulado',
    description: 'Lixo acumulado na esquina da rua há vários dias sem coleta.',
    user_id: 2,
    image_url: null,
    address: 'Rua das Acácias, 45 - Vila Nova',
    status: 'aberto',
    created_at: '2025-05-18T11:20:00',
    updated_at: '2025-05-18T11:20:00'
  },
  {
    id: 5,
    title: 'Semáforo com defeito',
    description: 'O semáforo da avenida principal com a rua lateral está piscando em amarelo continuamente.',
    user_id: 3,
    image_url: null,
    address: 'Avenida Brasil com Rua Rio Branco - Centro',
    status: 'em andamento',
    created_at: '2025-05-16T09:10:00',
    updated_at: '2025-05-17T10:45:00'
  }
];

// Função para enriquecer tickets com dados de usuário
export const getEnrichedTickets = () => {
  return mockTickets.map(ticket => {
    const user = mockUsers.find(user => user.id === ticket.user_id);
    return {
      ...ticket,
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        document: user.document,
        document_type: user.document_type
      } : null
    };
  });
};

// Função para simular login
export const mockLogin = (email, password) => {
  // Simulação simples: qualquer senha será aceita para os usuários mockados
  const user = mockUsers.find(user => user.email === email);
  
  if (user) {
    return {
      token: 'fake-jwt-token-' + Math.random().toString(36).substring(2),
      user: { ...user }
    };
  }
  
  throw new Error('Credenciais inválidas');
};

// Função para simular registro
export const mockRegister = (userData) => {
  // Verificar se email já existe
  if (mockUsers.some(user => user.email === userData.email)) {
    throw new Error('Email já cadastrado');
  }
  
  // Simulação de sucesso
  return { message: 'Usuário cadastrado com sucesso' };
};

// Função para simular criação de ticket
export const mockCreateTicket = (ticketData, userId) => {
  // Simulação de sucesso
  return { message: 'Ticket criado com sucesso' };
};

// Função para simular atualização de status
export const mockUpdateTicketStatus = (ticketId, status) => {
  // Simulação de sucesso
  return { message: 'Status atualizado com sucesso' };
};