
-- Create initial admin user
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', NOW(), NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Create initial profiles
INSERT INTO public.profiles (id, name, email, role, active, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Admin User', 'admin@example.com', 'admin', true, NOW()),
  ('00000000-0000-0000-0000-000000000002', 'Project Manager', 'pm@example.com', 'project_manager', true, NOW()),
  ('00000000-0000-0000-0000-000000000003', 'Team Member', 'team@example.com', 'team_member', true, NOW()),
  ('00000000-0000-0000-0000-000000000004', 'Client User', 'client@example.com', 'client', true, NOW())
ON CONFLICT DO NOTHING;

-- Create initial services
INSERT INTO public.services (id, name, description, price, icon, active, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Web Development', 'Custom website development', 5000, 'code', true, NOW()),
  ('00000000-0000-0000-0000-000000000002', 'Mobile App Development', 'iOS and Android app development', 10000, 'smartphone', true, NOW()),
  ('00000000-0000-0000-0000-000000000003', 'UI/UX Design', 'User interface and experience design', 3000, 'palette', true, NOW()),
  ('00000000-0000-0000-0000-000000000004', 'SEO Services', 'Search engine optimization', 1500, 'search', true, NOW())
ON CONFLICT DO NOTHING;

-- Create initial projects
INSERT INTO public.projects (id, name, description, status, progress, clientId, projectManagerId, startDate, endDate, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Website Redesign', 'Redesign of company website', 'in_progress', 60, '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '2023-01-15', NULL, NOW()),
  ('00000000-0000-0000-0000-000000000002', 'Mobile App', 'Development of mobile app', 'planning', 20, '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '2023-02-01', NULL, NOW())
ON CONFLICT DO NOTHING;

-- Add team members to projects
INSERT INTO public.project_team_members (projectId, userId)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

-- Connect services to projects
INSERT INTO public.project_services (projectId, serviceId)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;

-- Create initial tasks
INSERT INTO public.tasks (id, projectId, title, description, status, assigneeId, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Design Homepage', 'Create design mockup for homepage', 'completed', '00000000-0000-0000-0000-000000000003', NOW()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Implement Frontend', 'Develop frontend using React', 'in_progress', '00000000-0000-0000-0000-000000000003', NOW()),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'App Wireframing', 'Create wireframes for mobile app', 'todo', '00000000-0000-0000-0000-000000000003', NOW())
ON CONFLICT DO NOTHING;

-- Create initial messages
INSERT INTO public.messages (id, senderId, recipientId, content, read, timestamp)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'Hello! How is the project going?', false, NOW()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'It''s going well, thank you!', true, NOW())
ON CONFLICT DO NOTHING;

-- Create initial notifications
INSERT INTO public.notifications (id, userId, type, title, content, link, read, createdAt)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'project', 'Project Update', 'Your project has been updated', '/projects/00000000-0000-0000-0000-000000000001', false, NOW()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'message', 'New Message', 'You have a new message from Client User', '/messages', false, NOW())
ON CONFLICT DO NOTHING;

-- Create initial invoices
INSERT INTO public.invoices (id, clientId, projectId, amount, status, dueDate, issueDate, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 2500, 'sent', NOW() + INTERVAL '30 days', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Create invoice items
INSERT INTO public.invoice_items (id, invoiceId, description, quantity, unitPrice, total)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Web Development - Initial Payment', 1, 2500, 2500)
ON CONFLICT DO NOTHING;
