import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import type { SeatData } from '@/data/busData';

interface Props {
  seats: SeatData[];
  selectedSeats: string[];
  onToggleSeat: (seatNumber: string) => void;
  maxSeats?: number;
}

function SeatButton({ seat, isSelected, onClick }: { seat: SeatData; isSelected: boolean; onClick: () => void }) {
  const isBooked = seat.status === 'BOOKED' || seat.status === 'LOCKED';
  const isLadies = seat.status === 'LADIES';

  let className = 'w-10 h-10 rounded-md text-xs font-semibold transition-all border-2 ';
  if (isBooked) className += 'bg-muted text-muted-foreground border-muted cursor-not-allowed';
  else if (isSelected) className += 'bg-primary text-primary-foreground border-primary scale-105';
  else if (isLadies) className += 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 border-pink-300 dark:border-pink-700 hover:border-pink-500 cursor-pointer';
  else className += 'bg-card text-foreground border-border hover:border-primary cursor-pointer';

  return (
    <button className={className} disabled={isBooked} onClick={onClick} title={`${seat.seatNumber} - ₹${seat.price}`}>
      {seat.seatNumber}
    </button>
  );
}

export default function SeatMap({ seats, selectedSeats, onToggleSeat, maxSeats = 6 }: Props) {
  const { t } = useTranslation();
  const lowerSeats = seats.filter(s => s.deck === 'LOWER');
  const upperSeats = seats.filter(s => s.deck === 'UPPER');

  const renderDeck = (deckSeats: SeatData[]) => {
    const rows: SeatData[][] = [];
    for (let i = 0; i < deckSeats.length; i += 4) {
      rows.push(deckSeats.slice(i, i + 4));
    }
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-muted rounded-lg px-6 py-2 text-xs font-medium text-muted-foreground">
            🚌 {t('seats.driver')}
          </div>
        </div>
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-center gap-2">
            <SeatButton seat={row[0]} isSelected={selectedSeats.includes(row[0].seatNumber)} onClick={() => onToggleSeat(row[0].seatNumber)} />
            {row[1] && <SeatButton seat={row[1]} isSelected={selectedSeats.includes(row[1].seatNumber)} onClick={() => onToggleSeat(row[1].seatNumber)} />}
            <div className="w-6" />
            {row[2] && <SeatButton seat={row[2]} isSelected={selectedSeats.includes(row[2].seatNumber)} onClick={() => onToggleSeat(row[2].seatNumber)} />}
            {row[3] && <SeatButton seat={row[3]} isSelected={selectedSeats.includes(row[3].seatNumber)} onClick={() => onToggleSeat(row[3].seatNumber)} />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Tabs defaultValue="lower">
        <TabsList className="w-full">
          <TabsTrigger value="lower" className="flex-1">{t('seats.lowerDeck')}</TabsTrigger>
          <TabsTrigger value="upper" className="flex-1">{t('seats.upperDeck')}</TabsTrigger>
        </TabsList>
        <TabsContent value="lower" className="mt-4">{renderDeck(lowerSeats)}</TabsContent>
        <TabsContent value="upper" className="mt-4">{renderDeck(upperSeats)}</TabsContent>
      </Tabs>
      <div className="flex items-center gap-4 mt-4 text-xs justify-center flex-wrap">
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded border-2 border-border bg-card" /> {t('seats.available')}</span>
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-primary" /> {t('seats.selected')}</span>
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-muted" /> {t('seats.booked')}</span>
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-pink-100 dark:bg-pink-900/30 border-2 border-pink-300" /> {t('seats.ladies')}</span>
      </div>
    </div>
  );
}
