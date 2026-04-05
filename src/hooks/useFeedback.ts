import { supabase } from '../lib/supabase';

interface FeedbackData {
  type: 'bug' | 'idea' | 'mejora' | 'queja';
  text: string;
  screen: string;
  device_info: string;
  created_by: string;
}

export function useFeedback() {
  const sendFeedback = async (data: FeedbackData) => {
    if (!supabase) throw new Error('Sin conexión');
    const { error } = await supabase
      .from('feedback')
      .insert({ ...data, status: 'new' });
    if (error) throw new Error(error.message);
  };

  return { sendFeedback };
}
