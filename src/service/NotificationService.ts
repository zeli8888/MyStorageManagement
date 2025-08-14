import { SnackbarKey } from 'notistack';

type NotificationVariant = 'default' | 'error' | 'success' | 'warning' | 'info';

class NotificationService {
  // uninitialized default handler, won't work until initialized
  private static readonly defaultHandler = {
    enqueueSnackbar: (message: string, options?: { variant: NotificationVariant }) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Notification Service not initialized!');
      }
      return '' as SnackbarKey;
    }
  };

  private handler: {
    enqueueSnackbar: (
      message: string,
      options?: { variant: NotificationVariant }
    ) => SnackbarKey;
  } = NotificationService.defaultHandler;

  public reset() {
    // reset handler to prevent memory leak
    this.handler = { ...NotificationService.defaultHandler };
  }

  public initialize(handler: typeof this.handler) {
    this.handler = handler;
  }

  public show(
    message: string,
    variant: NotificationVariant = 'default'
  ): SnackbarKey {
    return this.handler.enqueueSnackbar(message, { variant });
  }

  public error(message: string): SnackbarKey {
    return this.show(message, 'error');
  }

  public success(message: string): SnackbarKey {
    return this.show(message, 'success');
  }

  public warning(message: string): SnackbarKey {
    return this.show(message, 'warning');
  }

  public info(message: string): SnackbarKey {
    return this.show(message, 'info');
  }
}

export default new NotificationService();

export type { NotificationVariant };