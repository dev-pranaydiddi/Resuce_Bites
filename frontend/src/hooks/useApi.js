// src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';
import {
  getAllDonations,
  createDonation,
  updateDonation,
  getAllTestimonials,
  getAllOrganizations,
  // getRequestsByDonation,
  // getRequestsByOrganization,
  updateRequest,
  loginUser,
  checkUserSession,
  logoutUser
} from '../lib/donation-api';

// ── Data fetching hooks ──────────────────────────────────────────────────────

export function useDonations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(() => {
    setLoading(true);
    getAllDonations()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, error, refetch: fetch };
}

export function useTestimonials() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    getAllTestimonials()
      .then(d => mounted && setData(d))
      .catch(err => mounted && setError(err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return { data, loading, error };
}

export function useOrganizations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    getAllOrganizations()
      .then(d => mounted && setData(d))
      .catch(err => mounted && setError(err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return { data, loading, error };
}

export function useRequestsByDonation(donationId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!donationId) return;
    let mounted = true;
    getRequestsByDonation(donationId)
      .then(d => mounted && setData(d))
      .catch(err => mounted && setError(err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [donationId]);

  return { data, loading, error };
}

export function useRequestsByOrganization(orgId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orgId) return;
    let mounted = true;
    getRequestsByOrganization(orgId)
      .then(d => mounted && setData(d))
      .catch(err => mounted && setError(err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [orgId]);

  return { data, loading, error };
}

// ── Mutation hooks ───────────────────────────────────────────────────────────

export function useCreateDonation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      return await createDonation(payload);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}

export function useUpdateDonation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      return await updateDonation(id, payload);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}

export function useUpdateRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      return await updateRequest(id, payload);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}

// ── Auth hooks ───────────────────────────────────────────────────────────────

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (creds) => {
    setLoading(true);
    setError(null);
    try {
      return await loginUser(creds.username, creds.password);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading, error };
}

export function useSession() {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const sess = await checkUserSession();
      setUser(sess.user);
      setOrganization(sess.organization);
    } catch {
      setUser(null);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { user, organization, loading, refresh };
}

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutUser();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { logout, loading, error };
}
