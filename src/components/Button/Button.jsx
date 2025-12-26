import React from 'react';
import styled, { css } from 'styled-components';

const sizes = {
  small: css`
    padding: 6px 12px;
    font-size: 0.85rem;
  `,
  medium: css`
    padding: 10px 20px;
    font-size: 0.95rem;
  `,
  large: css`
    padding: 14px 28px;
    font-size: 1.1rem;
  `,
};

const variants = {
  primary: css`
    background-color: var(--primary-color);
    color: white;
    border: none;
    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(100, 108, 255, 0.3);
    }
  `,
  secondary: css`
    background-color: var(--card-bg);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    &:hover {
      background-color: var(--hover-bg);
    }
  `,
  danger: css`
    background-color: rgba(255, 59, 48, 0.1);
    color: #ff3b30;
    border: none;
    &:hover {
      background-color: #ff3b30;
      color: white;
      transform: scale(1.05);
    }
  `,
  ghost: css`
    background: none;
    border: none;
    color: var(--text-color);
    &:hover {
      background-color: var(--hover-bg);
    }
  `,
  outline: css`
    background: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    &:hover {
      background-color: var(--primary-color);
      color: white;
    }
  `,
  success: css`
    background-color: #4caf50;
    color: white;
    border: none;
    &:hover {
      background-color: #45a049;
    }
  `,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  opacity: ${props => props.disabled || props.$loading ? 0.6 : 1};
  pointer-events: ${props => props.disabled || props.$loading ? 'none' : 'auto'};

  ${props => sizes[props.$size || 'medium']}
  ${props => variants[props.$variant || 'primary']}
`;

const LoadingSpinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  leftIcon, 
  rightIcon, 
  loading = false, 
  fullWidth = false,
  as,
  ...props 
}) => {
  return (
    <StyledButton 
      as={as}
      $variant={variant} 
      $size={size} 
      $loading={loading} 
      $fullWidth={fullWidth}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && leftIcon && <span className="button-icon">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="button-icon">{rightIcon}</span>}
    </StyledButton>
  );
};

export default Button;
