declare module '*.json' {
  const value: SecurityConfig;
  export default value;
}

export interface SecurityConfig {
  roleHierarchy: string[];
}

