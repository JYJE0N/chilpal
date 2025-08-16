import { useReducer, Dispatch } from 'react';
import { DrawnCard, TarotCard } from '@/types/tarot';
import { SpreadType } from '@/types/spreads';

export interface ReadingState {
  // 기본 상태
  question: string;
  spreadType: SpreadType;
  phase: 'spread-selection' | 'question' | 'selection' | 'result';
  
  // 카드 관련
  availableCards: DrawnCard[];
  selectedCards: DrawnCard[];
  revealedCards: Set<number>;
  
  // UI 상태
  isShuffling: boolean;
  shuffleKey: number;
  scrollProgress: number;
  showTopButton: boolean;
  currentPlaceholder: string;
  
  // 저장 관련
  lastSavedReadingId: string | null;
  isSavingReading: boolean;
  savedReadingId: string | null;
  
  // Pull to refresh
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
}

export type ReadingAction =
  | { type: 'SET_QUESTION'; payload: string }
  | { type: 'SET_SPREAD_TYPE'; payload: SpreadType }
  | { type: 'SET_PHASE'; payload: ReadingState['phase'] }
  | { type: 'SET_AVAILABLE_CARDS'; payload: DrawnCard[] }
  | { type: 'ADD_SELECTED_CARD'; payload: DrawnCard }
  | { type: 'RESET_SELECTED_CARDS' }
  | { type: 'ADD_REVEALED_CARD'; payload: number }
  | { type: 'SET_SHUFFLING'; payload: boolean }
  | { type: 'SET_SHUFFLE_KEY'; payload: number }
  | { type: 'SET_SCROLL_PROGRESS'; payload: number }
  | { type: 'SET_SHOW_TOP_BUTTON'; payload: boolean }
  | { type: 'SET_CURRENT_PLACEHOLDER'; payload: string }
  | { type: 'SET_LAST_SAVED_READING_ID'; payload: string | null }
  | { type: 'SET_IS_SAVING_READING'; payload: boolean }
  | { type: 'SET_SAVED_READING_ID'; payload: string | null }
  | { type: 'SET_PULL_STATE'; payload: { isPulling: boolean; pullDistance: number; isRefreshing: boolean } }
  | { type: 'RESET_READING' };

export const initialReadingState: ReadingState = {
  question: '',
  spreadType: 'one-card',
  phase: 'spread-selection',
  availableCards: [],
  selectedCards: [],
  revealedCards: new Set(),
  isShuffling: false,
  shuffleKey: 0,
  scrollProgress: 0,
  showTopButton: false,
  currentPlaceholder: '',
  lastSavedReadingId: null,
  isSavingReading: false,
  savedReadingId: null,
  isPulling: false,
  pullDistance: 0,
  isRefreshing: false,
};

export function readingReducer(state: ReadingState, action: ReadingAction): ReadingState {
  switch (action.type) {
    case 'SET_QUESTION':
      return { ...state, question: action.payload };
      
    case 'SET_SPREAD_TYPE':
      return { ...state, spreadType: action.payload };
      
    case 'SET_PHASE':
      return { ...state, phase: action.payload };
      
    case 'SET_AVAILABLE_CARDS':
      return { ...state, availableCards: action.payload };
      
    case 'ADD_SELECTED_CARD':
      return { 
        ...state, 
        selectedCards: [...state.selectedCards, action.payload] 
      };
      
    case 'RESET_SELECTED_CARDS':
      return { ...state, selectedCards: [] };
      
    case 'ADD_REVEALED_CARD':
      return { 
        ...state, 
        revealedCards: new Set([...state.revealedCards, action.payload]) 
      };
      
    case 'SET_SHUFFLING':
      return { ...state, isShuffling: action.payload };
      
    case 'SET_SHUFFLE_KEY':
      return { ...state, shuffleKey: action.payload };
      
    case 'SET_SCROLL_PROGRESS':
      return { ...state, scrollProgress: action.payload };
      
    case 'SET_SHOW_TOP_BUTTON':
      return { ...state, showTopButton: action.payload };
      
    case 'SET_CURRENT_PLACEHOLDER':
      return { ...state, currentPlaceholder: action.payload };
      
    case 'SET_LAST_SAVED_READING_ID':
      return { ...state, lastSavedReadingId: action.payload };
      
    case 'SET_IS_SAVING_READING':
      return { ...state, isSavingReading: action.payload };
      
    case 'SET_SAVED_READING_ID':
      return { ...state, savedReadingId: action.payload };
      
    case 'SET_PULL_STATE':
      return { 
        ...state, 
        isPulling: action.payload.isPulling,
        pullDistance: action.payload.pullDistance,
        isRefreshing: action.payload.isRefreshing
      };
      
    case 'RESET_READING':
      return {
        ...initialReadingState,
        shuffleKey: state.shuffleKey + 1,
      };
      
    default:
      return state;
  }
}

export function useReadingState() {
  const [state, dispatch] = useReducer(readingReducer, initialReadingState);
  return { state, dispatch };
}

export type ReadingDispatch = Dispatch<ReadingAction>;