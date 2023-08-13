INSERT INTO users (id)
VALUES 
    ('foo')
,   ('bar')
,   ('baz');
INSERT INTO articles (id, content, user)
VALUES 
    ('a', 'Let''s learn Go', 'foo')
,   ('b', 'Why I love Deno', 'foo')
,   ('c', 'HTMX is awesome', 'baz');