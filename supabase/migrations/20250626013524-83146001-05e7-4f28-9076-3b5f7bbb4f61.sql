
-- Corrigir a ordenação duplicada das categorias
-- Definir sort_order únicos para todas as categorias (0-11)
UPDATE forum_categories 
SET sort_order = CASE 
  WHEN name = 'Apoio Emocional' THEN 0
  WHEN name = 'Histórias de Superação' THEN 1
  WHEN name = 'Dúvidas e Orientações' THEN 2
  WHEN name = 'Grupos de Apoio' THEN 3
  WHEN name = 'Recursos e Ferramentas' THEN 4
  WHEN name = 'Memórias e Homenagens' THEN 5
  WHEN name = 'Cuidadores e Familiares' THEN 6
  WHEN name = 'Espiritualidade e Fé' THEN 7
  WHEN name = 'Crianças e Adolescentes' THEN 8
  WHEN name = 'Luto Perinatal' THEN 9
  WHEN name = 'Eventos e Atividades' THEN 10
  WHEN name = 'Geral' THEN 11
  ELSE sort_order + 100  -- Para outras categorias não listadas
END;

-- Garantir que todas as categorias têm descrições não nulas
UPDATE forum_categories 
SET description = COALESCE(description, 'Categoria para discussões e apoio mútuo')
WHERE description IS NULL OR description = '';
