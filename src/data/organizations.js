import anniaPreview from '../assets/annia-preview.png';
import vidaPreview from '../assets/vida-preview.png';

const organizationAssets = {
  annia: {
    previewImage: anniaPreview,
    url: 'https://annia.no',
  },
  vida: {
    previewImage: vidaPreview,
    url: 'https://www.vidaalcentro.com',
  },
  direccion: {},
};

export const getOrganizations = (orgs = []) =>
  orgs.map((org) => ({
    ...org,
    ...(organizationAssets[org.id] ?? {}),
  }));
