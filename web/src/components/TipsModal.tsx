import React, { useState, useEffect } from 'react';
import { useT } from '../i18n';
import { Modal } from './Modal';
import { CtaButton } from './Buttons';
import { getSetting, setSetting } from '../services/db';

interface TipsModalProps {
  moment: 'waiting' | 'booth' | 'result';
  isOpen: boolean;
  onClose: () => void;
}

export const TipsModal: React.FC<TipsModalProps> = ({ moment, isOpen, onClose }) => {
  const { t } = useT();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const settingKey = `virtualan.tips_optout.${moment}`;

  useEffect(() => {
    if (isOpen) {
      getSetting<boolean>(settingKey, false).then((optOut) => {
        if (optOut) {
          onClose(); // Automatically close if opted out
        }
      });
    }
  }, [isOpen, settingKey, onClose]);

  const handleUnderstand = async () => {
    if (dontShowAgain) {
      await setSetting(settingKey, true);
    }
    onClose();
  };

  const getTipText = () => {
    switch (moment) {
      case 'waiting':
        return t.tips.waitingTips;
      case 'booth':
        return t.tips.boothTips;
      case 'result':
        return t.tips.resultTips;
      default:
        return '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleUnderstand} title={t.tips.title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          backgroundColor: '#FDECEF',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}>
          <span style={{ fontSize: '24px' }}>💡</span>
          <p style={{ fontSize: '14px', color: '#831843', lineHeight: 1.5, fontWeight: 500 }}>
            {getTipText()}
          </p>
        </div>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          color: '#4B5563',
          cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: '#0B0B12' }}
          />
          <span>{t.tips.dontShowAgain}</span>
        </label>

        <CtaButton onClick={handleUnderstand}>
          {t.tips.understand}
        </CtaButton>
      </div>
    </Modal>
  );
};
