import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { authorsApi, booksApi, reviewsApi } from './api';
import logo from './haibazo-wireframe.png';


const PAGE_SIZE = 5;

const resourceConfig = {
  authors: {
    name: 'Authors',
    singular: 'Author',
    listPath: '/authors',
    createPath: '/authors/create',
    listTitle: 'Authors > List',
    createTitle: 'Authors > Create',
    listDescription: 'Manage writer records and track how many books belong to each author.',
    createDescription: 'Add a new author to the catalog.',
    api: authorsApi,
    fields: [
      { name: 'name', label: 'Name', type: 'text', placeholder: 'Name', error: '* Please enter name' },
    ],
    buildFormValues: (item) => ({ name: item?.name || '' }),
    columns: [
      { label: 'No', render: (item) => item.id },
      { label: 'Name', render: (item) => item.name },
      { label: 'Books', render: (item) => item.booksCount },
    ],
    createButtonLabel: 'Create',
  },
  books: {
    name: 'Books',
    singular: 'Book',
    listPath: '/books',
    createPath: '/books/create',
    listTitle: 'Books > List',
    createTitle: 'Books > Create',
    listDescription: 'Review books, authors and actions in one place.',
    createDescription: 'Add a new book and link it to an author.',
    api: booksApi,
    fields: [
      { name: 'title', label: 'Title', type: 'text', placeholder: 'Title', error: '* Please enter name' },
      { name: 'authorId', label: 'Author', type: 'select', placeholder: 'Select author', error: '* Please select author', optionsKey: 'authors' },
    ],
    buildFormValues: (item) => ({
      title: item?.title || '',
      authorId: item?.authorId ? String(item.authorId) : '',
    }),
    columns: [
      { label: 'No', render: (item) => item.id },
      { label: 'Title', render: (item) => item.title },
      { label: 'Author', render: (item) => item.authorName },
    ],
    createButtonLabel: 'Create',
  },
  reviews: {
    name: 'Reviews',
    singular: 'Review',
    listPath: '/reviews',
    createPath: '/reviews/create',
    listTitle: 'Reviews > List',
    createTitle: 'Reviews > Create',
    listDescription: 'See each book review with its author and assigned book.',
    createDescription: 'Add a new review for a selected book.',
    api: reviewsApi,
    fields: [
      { name: 'bookId', label: 'Book', type: 'select', placeholder: 'Select book', error: '* Please select book', optionsKey: 'books' },
      { name: 'review', label: 'Review', type: 'textarea', placeholder: 'Review', error: '* Please enter review' },
    ],
    buildFormValues: (item) => ({
      bookId: item?.bookId ? String(item.bookId) : '',
      review: item?.review || '',
    }),
    columns: [
      { label: 'No', render: (item) => item.id },
      { label: 'Book', render: (item) => item.bookTitle },
      { label: 'Author', render: (item) => item.authorName },
      { label: 'Review', render: (item) => item.review },
    ],
    createButtonLabel: 'Create',
  },
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/authors" replace />} />
      <Route element={<Shell />}>
        <Route path="/authors" element={<ListPage resourceKey="authors" />} />
        <Route path="/authors/create" element={<CreatePage resourceKey="authors" />} />
        <Route path="/books" element={<ListPage resourceKey="books" />} />
        <Route path="/books/create" element={<CreatePage resourceKey="books" />} />
        <Route path="/reviews" element={<ListPage resourceKey="reviews" />} />
        <Route path="/reviews/create" element={<CreatePage resourceKey="reviews" />} />
        <Route path="*" element={<Navigate to="/authors" replace />} />
      </Route>
    </Routes>
  );
}

function Shell() {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(() => {
    if (location.pathname.startsWith('/authors')) return 'authors';
    if (location.pathname.startsWith('/books')) return 'books';
    if (location.pathname.startsWith('/reviews')) return 'reviews';
    return 'authors';
  });

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <div className="brand-mark">
            <img src={logo} alt="Haibazo Logo" />
          </div>
          <div>
            <p className="brand-kicker">HAIBAZO</p>
            <h1>Book Review</h1>
          </div>
        </div>

        <nav className="nav-groups" aria-label="Primary">
          <NavGroup
            title="Authors"
            basePath="/authors"
            isOpen={openGroup === 'authors'}
            onToggle={() => setOpenGroup(openGroup === 'authors' ? null : 'authors')}
          />
          <NavGroup
            title="Books"
            basePath="/books"
            isOpen={openGroup === 'books'}
            onToggle={() => setOpenGroup(openGroup === 'books' ? null : 'books')}
          />
          <NavGroup
            title="Reviews"
            basePath="/reviews"
            isOpen={openGroup === 'reviews'}
            onToggle={() => setOpenGroup(openGroup === 'reviews' ? null : 'reviews')}
          />
        </nav>
      </aside>

      <main className="content-shell">
        <div className="content-frame">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavGroup({ title, basePath, isOpen, onToggle }) {
  const location = useLocation();
  const isActiveGroup = location.pathname.startsWith(basePath);

  return (
    <section className="nav-group">
      <button
        className={`nav-group-button ${isOpen || isActiveGroup ? 'open' : ''}`}
        onClick={onToggle}
        type="button"
      >
        <span>{title}</span>
        <span className="chevron">{isOpen ? '▼' : '▶'}</span>
      </button>
      {isOpen && (
        <div className="nav-group-links">
          <NavLink end to={basePath} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            List
          </NavLink>
          <NavLink end to={`${basePath}/create`} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Create
          </NavLink>
        </div>
      )}
    </section>
  );
}

function ListPage({ resourceKey }) {
  const config = resourceConfig[resourceKey];
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({
    items: [],
    meta: {
      currentPage: 1,
      pageSize: PAGE_SIZE,
      totalPages: 0,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({ authors: [], books: [] });
  const [flash, setFlash] = useState(location.state?.flash || '');
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setFlash(location.state?.flash || '');
    if (location.state?.flash) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    let active = true;
    async function loadList() {
      setLoading(true);
      try {
        const response = await config.api.list(page, PAGE_SIZE);
        if (!active) return;
        setData(response);
        if (response.meta.totalPages > 0 && page > response.meta.totalPages) {
          setPage(response.meta.totalPages);
        }
      } catch (error) {
        if (active) {
          setFlash(error.message || 'Failed to load data');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadList();
    return () => {
      active = false;
    };
  }, [config.api, page]);

  useEffect(() => {
    let active = true;
    async function loadOptions() {
      try {
        const nextOptions = await loadResourceOptions(resourceKey);
        if (active) {
          setOptions(nextOptions);
        }
      } catch {
        if (active) {
          setOptions({ authors: [], books: [] });
        }
      }
    }
    loadOptions();
    return () => {
      active = false;
    };
  }, [resourceKey]);

  const totalPages = data.meta.totalPages || 0;

  async function handleSave(itemId, values) {
    setBusy(true);
    try {
      await config.api.update(itemId, values);
      setEditingItem(null);
      setFlash(`${config.singular} updated successfully.`);
      const response = await config.api.list(page, PAGE_SIZE);
      setData(response);
    } catch (error) {
      throw error;
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!deletingItem) return;
    setBusy(true);
    try {
      await config.api.remove(deletingItem.id);
      setDeletingItem(null);
      setFlash(`${config.singular} deleted successfully.`);
      const response = await config.api.list(page, PAGE_SIZE);
      setData(response);
    } catch (error) {
      setFlash(error.message || 'Failed to delete item');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="screen-stack">
      <PageHeader
        title={config.listTitle}
        description={config.listDescription}
        action={
          <button className="primary-button" onClick={() => navigate(config.createPath)} type="button">
            {config.createButtonLabel}
          </button>
        }
      />

      {flash ? <Banner>{flash}</Banner> : null}

      <div className="panel table-panel">
        <div className="panel-header">
          <div>
            <p className="panel-kicker">Current records</p>
            <h2>{config.name}</h2>
          </div>
          <div className="panel-chip">Page size {PAGE_SIZE}</div>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                {config.columns.map((column) => (
                  <th key={column.label}>{column.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={config.columns.length + 1} className="empty-cell">
                    Loading records...
                  </td>
                </tr>
              ) : data.items.length ? (
                data.items.map((item, index) => (
                  <tr key={item.id}>
                    {config.columns.map((column) => (
                      <td key={column.label} data-label={column.label}>
                        {column.render(item, index)}
                      </td>
                    ))}
                    <td>
                      <div className="row-actions">
                        <button className="ghost-button" type="button" onClick={() => setEditingItem(item)}>
                          Update
                        </button>
                        <button className="danger-button" type="button" onClick={() => setDeletingItem(item)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={config.columns.length + 1} className="empty-cell">
                    No records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination meta={data.meta} page={page} onChange={setPage} />
      </div>

      <UpdateModal
        resourceKey={resourceKey}
        item={editingItem}
        options={options}
        onClose={() => setEditingItem(null)}
        onSave={handleSave}
        busy={busy}
      />

      <ConfirmModal
        open={Boolean(deletingItem)}
        title={`Delete ${config.singular}`}
        message={`Are you sure you want to delete this ${config.singular.toLowerCase()}?`}
        onCancel={() => setDeletingItem(null)}
        onConfirm={handleDelete}
        busy={busy}
      />
    </section>
  );
}

function CreatePage({ resourceKey }) {
  const config = resourceConfig[resourceKey];
  const navigate = useNavigate();
  const [values, setValues] = useState(config.buildFormValues(null));
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState({ authors: [], books: [] });
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    let active = true;
    async function loadOptions() {
      try {
        const nextOptions = await loadResourceOptions(resourceKey);
        if (active) {
          setOptions(nextOptions);
        }
      } catch {
        if (active) {
          setOptions({ authors: [], books: [] });
        }
      }
    }
    loadOptions();
    return () => {
      active = false;
    };
  }, [resourceKey]);

  function handleChange(fieldName, value) {
    setValues((current) => ({ ...current, [fieldName]: value }));
    setErrors((current) => ({ ...current, [fieldName]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateValues(config, values);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload = buildPayload(resourceKey, values);
    setBusy(true);
    try {
      await config.api.create(payload);
      setFlash(`${config.singular} created successfully.`);
      setValues(config.buildFormValues(null));
      setErrors({});
      navigate(config.listPath, { state: { flash: `${config.singular} created successfully.` } });
    } catch (error) {
      setFlash(error.message || 'Failed to create record');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="screen-stack">
      <PageHeader
        title={config.createTitle}
        description={config.createDescription}
        action={
          <button className="secondary-button" onClick={() => navigate(config.listPath)} type="button">
            Back to list
          </button>
        }
      />

      {flash ? <Banner>{flash}</Banner> : null}

      <div className="panel form-panel">
        <div className="panel-header">
          <div>
            <p className="panel-kicker">Create form</p>
            <h2>{config.name}</h2>
          </div>
          <div className="panel-chip">Validation on submit</div>
        </div>

        <EntityForm
          resourceKey={resourceKey}
          values={values}
          errors={errors}
          options={options}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel={config.createButtonLabel}
          busy={busy}
        />
      </div>
    </section>
  );
}

function PageHeader({ title, description, action }) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">HAIBAZO BOOK REVIEW</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      <div className="page-action">{action}</div>
    </header>
  );
}

function Banner({ children }) {
  return <div className="banner">{children}</div>;
}

function Pagination({ meta, page, onChange }) {
  const pages = useMemo(() => buildPageItems(meta.totalPages, page), [meta.totalPages, page]);

  if (!meta.totalPages) {
    return null;
  }

  return (
    <div className="pagination">
      <button type="button" className="page-button" onClick={() => onChange(Math.max(page - 1, 1))} disabled={page <= 1}>
        Prev
      </button>
      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="ellipsis">
            ...
          </span>
        ) : (
          <button
            type="button"
            key={item}
            className={`page-button ${item === page ? 'active' : ''}`}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        className="page-button"
        onClick={() => onChange(Math.min(page + 1, meta.totalPages))}
        disabled={page >= meta.totalPages}
      >
        Next
      </button>
    </div>
  );
}

function buildPageItems(totalPages, currentPage) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage]);
  if (currentPage - 1 > 1) pages.add(currentPage - 1);
  if (currentPage + 1 < totalPages) pages.add(currentPage + 1);

  return Array.from(pages)
    .sort((a, b) => a - b)
    .flatMap((value, index, array) => {
      const result = [value];
      const next = array[index + 1];
      if (next && next - value > 1) {
        result.push('ellipsis');
      }
      return result;
    });
}

function UpdateModal({ resourceKey, item, options, onClose, onSave, busy }) {
  const config = resourceConfig[resourceKey];
  const [values, setValues] = useState(config.buildFormValues(item));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(config.buildFormValues(item));
    setErrors({});
  }, [config, item]);

  if (!item) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateValues(config, values);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSave(item.id, buildPayload(resourceKey, values));
    } catch (error) {
      setErrors({ form: error.message || 'Failed to update record' });
    }
  }

  function handleChange(fieldName, value) {
    setValues((current) => ({ ...current, [fieldName]: value }));
    setErrors((current) => ({ ...current, [fieldName]: '' }));
  }

  return (
    <Modal title={`Update ${config.singular}`} onClose={onClose}>
      <EntityForm
        resourceKey={resourceKey}
        values={values}
        errors={errors}
        options={options}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        busy={busy}
        submitClassName="primary-button"
      />
      {errors.form ? <p className="inline-error">{errors.form}</p> : null}
    </Modal>
  );
}

function ConfirmModal({ open, title, message, onCancel, onConfirm, busy }) {
  if (!open) {
    return null;
  }

  return (
    <Modal title={title} onClose={onCancel} compact>
      <p className="confirm-message">{message}</p>
      <div className="confirm-actions">
        <button className="secondary-button" type="button" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button className="danger-button" type="button" onClick={onConfirm} disabled={busy}>
          Delete
        </button>
      </div>
    </Modal>
  );
}

function Modal({ title, children, onClose, compact = false }) {
  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div className={`modal-card ${compact ? 'compact' : ''}`} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EntityForm({ resourceKey, values, errors, options, onChange, onSubmit, submitLabel, busy, submitClassName = 'primary-button' }) {
  const config = resourceConfig[resourceKey];

  return (
    <form className="entity-form" onSubmit={onSubmit}>
      {config.fields.map((field) => (
        <label className="field" key={field.name}>
          <span className="field-label">{field.label}</span>
          {field.type === 'select' ? (
            <select
              value={values[field.name]}
              onChange={(event) => onChange(field.name, event.target.value)}
              className={errors[field.name] ? 'has-error' : ''}
            >
              <option value="">{field.placeholder}</option>
              {getOptionsForField(field, options).map((option) => (
                <option key={option.id} value={option.id}>
                  {getOptionLabel(field, option)}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              rows="5"
              value={values[field.name]}
              onChange={(event) => onChange(field.name, event.target.value)}
              placeholder={field.placeholder}
              className={errors[field.name] ? 'has-error' : ''}
            />
          ) : (
            <input
              type="text"
              value={values[field.name]}
              onChange={(event) => onChange(field.name, event.target.value)}
              placeholder={field.placeholder}
              className={errors[field.name] ? 'has-error' : ''}
            />
          )}
          {errors[field.name] ? <span className="field-error">{errors[field.name]}</span> : null}
        </label>
      ))}

      <div className="form-actions">
        <button className={submitClassName} type="submit" disabled={busy}>
          {busy ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

function getOptionsForField(field, options) {
  if (field.optionsKey === 'authors') {
    return options.authors || [];
  }
  if (field.optionsKey === 'books') {
    return options.books || [];
  }
  return [];
}

function getOptionLabel(field, option) {
  if (field.optionsKey === 'authors') {
    return option.name;
  }
  if (field.optionsKey === 'books') {
    return option.title;
  }
  return String(option.id);
}

function validateValues(config, values) {
  const errors = {};
  for (const field of config.fields) {
    const rawValue = values[field.name];
    if (field.type === 'select') {
      if (!rawValue) {
        errors[field.name] = field.error;
      }
      continue;
    }

    if (!String(rawValue || '').trim()) {
      errors[field.name] = field.error;
    }
  }
  return errors;
}

function buildPayload(resourceKey, values) {
  if (resourceKey === 'authors') {
    return { name: values.name.trim() };
  }
  if (resourceKey === 'books') {
    return {
      title: values.title.trim(),
      authorId: Number(values.authorId),
    };
  }
  return {
    bookId: Number(values.bookId),
    review: values.review.trim(),
  };
}

async function loadResourceOptions(resourceKey) {
  if (resourceKey === 'books') {
    const response = await authorsApi.all();
    return { authors: response.items || [], books: [] };
  }

  if (resourceKey === 'reviews') {
    const response = await booksApi.all();
    return { authors: [], books: response.items || [] };
  }

  return { authors: [], books: [] };
}

export default App;
