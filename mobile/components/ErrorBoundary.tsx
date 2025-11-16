import React, { Component, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary component para capturar erros em React
 * Previne que o app inteiro crashe quando há um erro em algum componente
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Captura erros durante a renderização
   */
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  /**
   * Chamado quando um erro é capturado
   * Aqui podemos logar o erro para um serviço de monitoramento
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log do erro (em produção, enviar para serviço de monitoramento)
    console.error('Error Boundary capturou erro:', error);
    console.error('Component stack:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo
    });

    // TODO: Enviar para serviço de monitoramento (Sentry, Bugsnag, etc)
    // Example: logErrorToService(error, errorInfo);
  }

  /**
   * Reseta o erro e tenta renderizar novamente
   */
  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Se fornecido um fallback customizado, usar ele
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Fallback padrão
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="warning" size={80} color="#ff4444" />
            </View>

            <Text style={styles.title}>Oops! Algo deu errado</Text>

            <Text style={styles.message}>
              Ocorreu um erro inesperado no aplicativo. Não se preocupe, seus dados estão salvos.
            </Text>

            <TouchableOpacity style={styles.button} onPress={this.resetError}>
              <Ionicons name="refresh" size={24} color="#fff" />
              <Text style={styles.buttonText}>Tentar Novamente</Text>
            </TouchableOpacity>

            {__DEV__ && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Detalhes do Erro (DEV):</Text>
                <Text style={styles.errorText}>{this.state.error.toString()}</Text>

                {this.state.error.stack && (
                  <>
                    <Text style={styles.errorTitle}>Stack Trace:</Text>
                    <Text style={styles.errorText}>{this.state.error.stack}</Text>
                  </>
                )}

                {this.state.errorInfo && (
                  <>
                    <Text style={styles.errorTitle}>Component Stack:</Text>
                    <Text style={styles.errorText}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  iconContainer: {
    marginBottom: 24
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center'
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16
  },
  button: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
  },
  errorDetails: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444'
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff4444',
    marginTop: 12,
    marginBottom: 8
  },
  errorText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#666',
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 4
  }
});
