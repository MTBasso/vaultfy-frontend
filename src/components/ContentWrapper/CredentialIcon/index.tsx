import { useEffect, useState } from 'react';
import { imageService } from '../../../services/image.service';
import './styles.sass';

interface CredentialIconProps {
  name: string;
}

export function CredentialIcon({ name }: CredentialIconProps) {
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    const fetchIcon = async () => {
      try {
        const svgData = await imageService.fetchSVG(name);
        setSvg(svgData.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchIcon();
  }, [name]);

  const base64Regex = /data:image\/jpeg;base64,[^"]+/;
  const base64Match = svg.match(base64Regex);
  const base64String = base64Match ? base64Match[0] : '';

  console.log(base64String);

  return (
    <div className="credential-icon">
      {base64String && (
        <img
          src={base64String}
          alt="Extracted SVG"
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
}
