import { describe, it, expect, vi } from 'vitest';
import { getHostBySlug, getAllHosts, sortHostsByName, getShowNameByLanguage } from './hosts';

// Mock Astro content collections
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

describe('Host Utilities', () => {
  describe('getShowNameByLanguage', () => {
    it('should return correct show names for each language', () => {
      expect(getShowNameByLanguage('en')).toBe('CRO.CAFE (English)');
      expect(getShowNameByLanguage('nl')).toBe('CRO.CAFE (Nederlands)');
      expect(getShowNameByLanguage('de')).toBe('CRO.CAFE (Deutsch)');
      expect(getShowNameByLanguage('es')).toBe('CRO.CAFE (Español)');
    });

    it('should return fallback for unknown language', () => {
      expect(getShowNameByLanguage('fr')).toBe('CRO.CAFE (fr)');
    });
  });

  describe('sortHostsByName', () => {
    it('should sort hosts alphabetically by name', () => {
      const mockHosts = [
        { data: { name: 'Yvonne', id: 'yvonne' } },
        { data: { name: 'Guido X Jansen', id: 'guido' } },
        { data: { name: 'Michael', id: 'michael' } },
        { data: { name: 'Ricardo', id: 'ricardo' } },
      ] as any;

      const sorted = sortHostsByName(mockHosts);

      expect(sorted[0].data.name).toBe('Guido X Jansen');
      expect(sorted[1].data.name).toBe('Michael');
      expect(sorted[2].data.name).toBe('Ricardo');
      expect(sorted[3].data.name).toBe('Yvonne');
    });

    it('should not mutate the original array', () => {
      const mockHosts = [
        { data: { name: 'Yvonne', id: 'yvonne' } },
        { data: { name: 'Guido X Jansen', id: 'guido' } },
      ] as any;

      const original = [...mockHosts];
      sortHostsByName(mockHosts);

      expect(mockHosts).toEqual(original);
    });
  });

  describe('getHostBySlug', async () => {
    it('should find host by slug', async () => {
      const mockHosts = [
        { data: { id: 'guido', name: 'Guido X Jansen' } },
        { data: { id: 'michael', name: 'Michael' } },
      ] as any;

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockHosts);

      const host = await getHostBySlug('guido');
      expect(host?.data.name).toBe('Guido X Jansen');
    });

    it('should return undefined for non-existent slug', async () => {
      const mockHosts = [{ data: { id: 'guido', name: 'Guido X Jansen' } }] as any;

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockHosts);

      const host = await getHostBySlug('nonexistent');
      expect(host).toBeUndefined();
    });
  });

  describe('getAllHosts', async () => {
    it('should return all hosts from collection', async () => {
      const mockHosts = [
        { data: { id: 'guido', name: 'Guido X Jansen' } },
        { data: { id: 'michael', name: 'Michael' } },
      ] as any;

      const { getCollection } = await import('astro:content');
      vi.mocked(getCollection).mockResolvedValue(mockHosts);

      const hosts = await getAllHosts();
      expect(hosts).toEqual(mockHosts);
      expect(vi.mocked(getCollection)).toHaveBeenCalledWith('hosts');
    });
  });
});
