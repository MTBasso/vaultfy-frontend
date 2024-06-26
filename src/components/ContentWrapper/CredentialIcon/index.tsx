import { memo, useEffect, useState } from 'react';
import { imageService } from '../../../services/image.service';
import './styles.sass';

interface CredentialIconProps {
  name: string;
  onLoad(): void;
}

export const CredentialIcon = memo(
  (props: CredentialIconProps) => {
    const { name, onLoad } = props;
    const [loading, setLoading] = useState(true);
    const [svg, setSvg] = useState<string>('');

    useEffect(() => {
      setLoading(true);

      const fetchIcon = async () => {
        setSvg('');

        try {
          const svgData = await imageService.fetchSVG(name);
          setSvg(svgData);
          if (onLoad) onLoad();
        } catch (error) {
          console.error('icon error: ', error);
        } finally {
          setLoading(false);
        }
      };

      fetchIcon();
    }, [name, onLoad]);

    const base64Regex = /data:image\/jpeg;base64,[^"]+/;
    const base64Match = svg.match(base64Regex);
    const base64String = base64Match ? base64Match[0] : '';

    return (
      <div className="credential-icon">
        {loading ? (
          <div className="skeleton-loading">
            <div className="skeleton-rectangle" />
          </div>
        ) : (
          base64String && <img src={base64String} alt="Extracted SVG" style={{ width: '100%', height: '100%' }} />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.name === nextProps.name;
  },
);
