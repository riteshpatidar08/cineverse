import React, { useState, useEffect } from 'react';
import {
  getFinanceTransactions,
  getFinanceSettlements,
  markSettlementPaid,
} from '../../services/admin.api.js';
import {
  CircleDollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  CheckCircle,
  Clock,
  Search,
  Filter,
  X,
  ArrowDownRight,
  ShieldCheck,
  Receipt,
} from 'lucide-react';

export default function AdminFinancePage() {
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'settlements'

  // Transactions state
  const [transactions, setTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Settlements state
  const [settlements, setSettlements] = useState([]);
  const [settleModalTheater, setSettleModalTheater] = useState(null);
  const [settleReference, setSettleReference] = useState('');
  const [settleCycle, setSettleCycle] = useState('October 2026');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await getFinanceTransactions({
        status: statusFilter,
        page,
        limit: 15,
      });
      if (res.data?.success) {
        setTransactions(res.data.data);
        setTotalTransactions(res.data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const res = await getFinanceSettlements();
      if (res.data?.success) {
        setSettlements(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions();
    } else {
      fetchSettlements();
    }
  }, [activeTab, page, statusFilter]);

  const handleMarkPaid = async (e) => {
    e.preventDefault();
    if (!settleModalTheater) return;
    setIsSubmitting(true);
    try {
      await markSettlementPaid(settleModalTheater.theaterId, {
        settlementCycle: settleCycle,
        amountPaid: settleModalTheater.netPayableToTheater,
        paymentReference: settleReference || `NEFT_CMS_${Date.now()}`,
      });
      setSettleModalTheater(null);
      fetchSettlements();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark settlement paid');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.4px' }}>
            Platform Finance &amp; Revenue Settlement
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            Master Razorpay payment traces, platform fee reconciliation, and cinema partner payouts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(0,0,0,0.3)',
            padding: 4,
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            onClick={() => setActiveTab('transactions')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'transactions' ? '#6366f1' : 'transparent',
              color: activeTab === 'transactions' ? '#fff' : '#94a3b8',
              transition: 'all 0.15s',
            }}
          >
            Transaction Log
          </button>

          <button
            onClick={() => setActiveTab('settlements')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'settlements' ? '#a855f7' : 'transparent',
              color: activeTab === 'settlements' ? '#fff' : '#94a3b8',
              transition: 'all 0.15s',
            }}
          >
            Partner Settlements (84% / 16%)
          </button>
        </div>
      </div>

      {activeTab === 'transactions' ? (
        /* ======================== TAB 1: TRANSACTIONS ======================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Status filter */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              style={{
                background: '#131929',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 8,
                padding: '8px 14px',
                color: '#ffffff',
                fontSize: 13,
                outline: 'none',
              }}
            >
              <option value="">All Payment Statuses</option>
              <option value="success">Success / Captured</option>
              <option value="failed">Failed / Refunded</option>
            </select>
          </div>

          <div
            style={{
              background: 'rgba(14, 19, 32, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 14,
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Order / Gateway ID</th>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Customer</th>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Cinema Hall</th>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Movie</th>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Seats Total</th>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Platform Fee</th>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Gross Amount</th>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        Loading transaction logs...
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        No transactions found in this period.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr
                        key={tx._id}
                        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                      >
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>
                            {tx.bookingId}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            {tx.createdAt ? new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                          </div>
                        </td>

                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{tx.user?.name || 'Walk-in'}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{tx.user?.email || tx.user?.mobileNo}</div>
                        </td>

                        <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>
                          {tx.theater?.name || 'Cinema Hall'}
                        </td>

                        <td style={{ padding: '14px 20px', color: '#ffffff', fontWeight: 600 }}>
                          {tx.movie?.title || 'Pushpa 2'} ({tx.ticketsCount || 1} tickets)
                        </td>

                        <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>
                          {formatINR(tx.seatsTotal)}
                        </td>

                        <td style={{ padding: '14px 20px', color: '#a855f7', fontWeight: 600 }}>
                          +{formatINR(tx.convenienceFee)}
                        </td>

                        <td style={{ padding: '14px 20px', color: '#34d399', fontWeight: 700 }}>
                          {formatINR(tx.totalAmount)}
                        </td>

                        <td style={{ padding: '14px 20px' }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: 'rgba(34, 197, 94, 0.15)',
                              color: '#4ade80',
                              border: '1px solid rgba(34, 197, 94, 0.3)',
                            }}
                          >
                            Success
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ======================== TAB 2: PARTNER SETTLEMENTS ======================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Formula Callout Banner */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 12,
              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.12) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <Receipt size={22} color="#c084fc" />
            <div style={{ fontSize: 13, color: '#e2e8f0' }}>
              <strong>Settlement Calculation Protocol:</strong> Partner Payout = Gross Ticket Collection minus 16% CineVerse Platform Facilitation Fee. Payouts are reconciled bi-weekly.
            </div>
          </div>

          <div
            style={{
              background: 'rgba(14, 19, 32, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 14,
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Cinema Partner</th>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>City</th>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Gross Ticket Sales</th>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Platform Fee (16%)</th>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Net Partner Payable</th>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11 }}>Settlement Status</th>
                    <th style={{ padding: '14px 20px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 11, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        Loading partner ledger...
                      </td>
                    </tr>
                  ) : settlements.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        No theater sales activity recorded yet for settlement.
                      </td>
                    </tr>
                  ) : (
                    settlements.map((s) => (
                      <tr
                        key={s.theaterId}
                        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                      >
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#ffffff' }}>{s.theaterName}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            {s.ticketsSold || 0} tickets &bull; {s.bookingsCount || 0} bookings
                          </div>
                        </td>

                        <td style={{ padding: '14px 20px', color: '#94a3b8' }}>
                          {s.city}
                        </td>

                        <td style={{ padding: '14px 20px', color: '#cbd5e1', fontWeight: 600 }}>
                          {formatINR(s.totalGrossSales)}
                        </td>

                        <td style={{ padding: '14px 20px', color: '#f472b6', fontWeight: 600 }}>
                          -{formatINR(s.platformCommission)}
                        </td>

                        <td style={{ padding: '14px 20px', color: '#34d399', fontWeight: 800, fontSize: 14 }}>
                          {formatINR(s.netPayableToTheater)}
                        </td>

                        <td style={{ padding: '14px 20px' }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: s.settlementStatus === 'settled' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                              color: s.settlementStatus === 'settled' ? '#4ade80' : '#facc15',
                              border: s.settlementStatus === 'settled' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
                              textTransform: 'uppercase',
                            }}
                          >
                            {s.settlementStatus}
                          </span>
                          {s.paymentReference && (
                            <div style={{ fontSize: 10, color: '#64748b', marginTop: 3 }}>
                              Ref: {s.paymentReference}
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          {s.settlementStatus !== 'settled' ? (
                            <button
                              onClick={() => {
                                setSettleModalTheater(s);
                                setSettleReference(`NEFT_CMS_${Date.now()}`);
                              }}
                              style={{
                                padding: '6px 12px',
                                borderRadius: 6,
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                border: 'none',
                                color: '#ffffff',
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Disburse Payout
                            </button>
                          ) : (
                            <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                              <CheckCircle size={14} color="#34d399" /> Disbursed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Disburse Payout Modal */}
      {settleModalTheater && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            backdropFilter: 'blur(6px)',
          }}
        >
          <div
            style={{
              background: '#0e1320',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 16,
              width: '100%',
              maxWidth: 440,
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
                Disburse Partner Payout
              </h3>
              <button
                onClick={() => setSettleModalTheater(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 14, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Theater Property</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>{settleModalTheater.theaterName}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{settleModalTheater.city}</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Net Partner Amount:</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#34d399' }}>
                  {formatINR(settleModalTheater.netPayableToTheater)}
                </span>
              </div>
            </div>

            <form onSubmit={handleMarkPaid} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Settlement Cycle Label
                </label>
                <input
                  type="text"
                  value={settleCycle}
                  onChange={(e) => setSettleCycle(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Bank NEFT / RTGS Reference ID *
                </label>
                <input
                  required
                  type="text"
                  value={settleReference}
                  onChange={(e) => setSettleReference(e.target.value)}
                  placeholder="e.g. NEFT_CMS_992182019"
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setSettleModalTheater(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#e2e8f0',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 8,
                    background: '#10b981',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isSubmitting ? 'Recording...' : 'Mark Disbursed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
