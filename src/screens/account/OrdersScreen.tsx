import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Clock, Package, Truck } from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import { formatRM } from '../../utils/format';

const STATUS_FILTERS: ('All' | OrderStatus)[] = [
  'All',
  'Processing',
  'Shipped',
  'Delivered',
];

function StatusIndicator({ status, label }: { status: OrderStatus; label: string }) {
  if (status === 'Delivered') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#4F407A]">
        <CheckCircle2 className="w-4 h-4 text-[#6D5D9B]" />
        <span>{label}</span>
      </span>
    );
  }
  if (status === 'Shipped') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#6D5D9B]">
        <Truck className="w-4 h-4" />
        <span>{label}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7A3F5D]">
      <Clock className="w-4 h-4" />
      <span>{label}</span>
    </span>
  );
}

export const OrdersScreen: React.FC = () => {
  const { orders, navigate, t } = useApp();
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');

  const filtered =
    statusFilter === 'All'
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.orders.title} showCart />

      <main className="px-4 pt-4 space-y-4">
        {/* Status Filter Tabs */}
        <div
          role="tablist"
          aria-label="Order Status Filter"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
        >
          {STATUS_FILTERS.map((status) => {
            const active = statusFilter === status;
            const label = status === 'All' ? t.orders.all : t.orders.statuses[status];
            return (
              <button
                key={status}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`min-h-[42px] px-4 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#7C69AE] text-white'
                    : 'bg-white border border-[#E9E1F3] text-[#635B73] hover:text-[#221E2C]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E9E1F3] p-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F6F2FB] flex items-center justify-center text-[#7C69AE]">
              <Package className="w-6 h-6" />
            </div>
            <h2 className="mt-4 font-display text-[19px] font-bold text-[#221E2C]">
              {t.orders.noOrdersTitle}
            </h2>
            <p className="mt-1.5 text-[14px] text-[#635B73]">
              {t.orders.noOrdersDesc}
            </p>
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="mt-5 min-h-[46px] px-6 py-2.5 rounded-xl bg-[#7C69AE] text-white text-[14px] font-semibold cursor-pointer"
            >
              {t.orders.startShopping}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <article
                key={order.id}
                className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F2ECF9]">
                  <div>
                    <p className="font-display text-[15px] font-bold text-[#221E2C] tabular-nums">
                      {order.orderNumber}
                    </p>
                    <p className="text-[12px] text-[#635B73]">{order.createdAt}</p>
                  </div>
                  <StatusIndicator status={order.status} label={t.orders.statuses[order.status]} />
                </div>

                {/* Products Preview */}
                <div className="space-y-2.5">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#FAF8FD] border border-[#F0E9F8] p-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-[#221E2C] truncate">
                          {item.name}
                        </p>
                        <p className="text-[12px] text-[#635B73] tabular-nums">
                          {item.size} · {t.common.qty} {item.quantity}
                        </p>
                      </div>
                      <span className="text-[14px] font-semibold text-[#221E2C] tabular-nums">
                        {formatRM(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#F2ECF9] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[12px] text-[#635B73]">{t.orders.totalAmount}</span>
                    <p className="font-display text-[17px] font-bold text-[#221E2C] tabular-nums">
                      {formatRM(order.total)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('order-detail', { orderId: order.id })}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-[#F6F2FB] hover:bg-[#E9E1F3] border border-[#DDD3EE] text-[#4F407A] text-[13px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{t.orders.orderDetails}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
