import { NotificacaoGateway } from './notificacao.gateway';

describe('NotificacaoGateway', () => {
  let gateway: NotificacaoGateway;
  const serverMock = {
    emit: jest.fn(),
    to: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    gateway = new NotificacaoGateway();
    gateway.server = serverMock as any;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should broadcast notifications to all clients', () => {
    const notification = { id: 1, titulo: 'Teste', mensagem: 'Opa' };
    gateway.broadcastNotification(notification);
    expect(serverMock.emit).toHaveBeenCalledWith('notification', notification);
  });

  it('should send notification to specific user room', () => {
    const notification = { id: 2, titulo: 'Teste', mensagem: 'Olá' };
    gateway.sendToUser(5, notification);
    expect(serverMock.to).toHaveBeenCalledWith('user_5');
    expect(serverMock.emit).toHaveBeenCalledWith('notification', notification);
  });
});
